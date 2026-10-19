<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReviewResource;
use App\Models\Place;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * The logged-in user's own reviews (any status).
     */
    public function index(Request $request)
    {
        $reviews = Review::with('place')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(8);

        return ReviewResource::collection($reviews);
    }

    /**
     * Submit a review. It stays "pending" until an administrator approves it.
     */
    public function store(Request $request, Place $place)
    {
        if ($place->status !== 'active') {
            abort(404);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $alreadyReviewed = Review::where('user_id', $request->user()->id)
            ->where('place_id', $place->id)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'message' => 'You have already reviewed this place.',
            ], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'place_id' => $place->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Review submitted and waiting for approval.',
            'data' => new ReviewResource($review->load(['user', 'place'])),
        ], 201);
    }

    /**
     * Delete a review. Only its author or an administrator may do this.
     */
    public function destroy(Request $request, Review $review)
    {
        if (
            $review->user_id !== $request->user()->id
            && ! $request->user()->isAdmin()
        ) {
            return response()->json([
                'message' => 'You can only delete your own reviews.',
            ], 403);
        }

        $review->delete();

        return response()->noContent();
    }
}
