<?php

namespace App\Http\Controllers;

use App\Models\ExplorationRequest;
use App\Models\Place;
use Illuminate\Http\Request;

class ExplorationRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = ExplorationRequest::with([
            'place',
            'user'
        ])
        ->where('user_id', $request->user()->id)
        ->latest()
        ->paginate(8);

        return response()->json($requests);
    }

    public function store(Request $request, Place $place)
    {
        $validated = $request->validate([
            'message' => [
                'nullable',
                'string',
                'max:1000'
            ],
        ]);

        $explorationRequest =
            ExplorationRequest::create([
                'user_id' => $request->user()->id,
                'place_id' => $place->id,
                'message' => $validated['message'] ?? null,
                'status' => 'pending',
            ]);

        return response()->json([
            'message' =>
                'Exploration request submitted.',
            'data' => $explorationRequest,
        ], 201);
    }

    public function updateStatus(
        Request $request,
        ExplorationRequest $explorationRequest
    ) {

        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin access required.'
            ], 403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:pending,approved,completed,rejected'
            ],
        ]);

        $explorationRequest->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Request status updated.',
            'data' => $explorationRequest->fresh()
                ->load(['user', 'place']),
        ]);
    }
}