<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlaceRequest;
use App\Http\Requests\UpdatePlaceRequest;
use App\Http\Resources\PlaceResource;
use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index(Request $request)
    {
        $places = Place::with(['region', 'category'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->region_id, function ($query, $regionId) {
                $query->where('region_id', $regionId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(8);

        return PlaceResource::collection($places);
    }

    public function store(StorePlaceRequest $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can create places.'
            ], 403);
        }

        $place = Place::create($request->validated());

        return response()->json([
            'message' => 'Place created successfully.',
            'data' => new PlaceResource(
                $place->load(['region', 'category'])
            ),
        ], 201);
    }

    public function show(Place $place)
    {
        return new PlaceResource(
            $place->load(['region', 'category', 'reviews.user'])
        );
    }

    public function update(
        UpdatePlaceRequest $request,
        Place $place
    ) {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can update places.'
            ], 403);
        }

        $place->update($request->validated());

        return response()->json([
            'message' => 'Place updated successfully.',
            'data' => new PlaceResource(
                $place->fresh()->load(['region', 'category'])
            ),
        ]);
    }

    public function destroy(Request $request, Place $place)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can delete places.'
            ], 403);
        }

        $place->delete();

        return response()->json([
            'message' => 'Place deleted successfully.',
        ], 204);
    }

    public function changeStatus(Request $request, Place $place)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can change status.'
            ], 403);
        }

        $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);

        $place->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Place status updated.',
            'data' => new PlaceResource(
                $place->fresh()->load(['region', 'category'])
            ),
        ]);
    }
}