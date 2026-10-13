<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Region::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin access required.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $region = Region::create($validated);

        return response()->json([
            'message' => 'Region created.',
            'data' => $region,
        ], 201);
    }

    public function update(Request $request, Region $region)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin access required.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $region->update($validated);

        return response()->json([
            'message' => 'Region updated.',
            'data' => $region,
        ]);
    }

    public function destroy(Request $request, Region $region)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin access required.'
            ], 403);
        }

        if ($region->places()->exists()) {
            return response()->json([
                'message' =>
                    'Cannot delete a region that has places.'
            ], 422);
        }

        $region->delete();

        return response()->json(null, 204);
    }
}