<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Place;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = Favorite::with([
            'place.region',
            'place.category'
        ])
        ->where('user_id', $request->user()->id)
        ->latest()
        ->paginate(8);

        return response()->json($favorites);
    }

    public function store(Request $request, Place $place)
    {
        $favorite = Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'place_id' => $place->id,
        ]);

        return response()->json([
            'message' => 'Place added to favorites.',
            'data' => $favorite,
        ], 201);
    }

    public function destroy(Request $request, Place $place)
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('place_id', $place->id)
            ->delete();

        return response()->json([
            'message' => 'Place removed from favorites.',
        ]);
    }
}