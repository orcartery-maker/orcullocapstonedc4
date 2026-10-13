<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ExplorationRequest;
use App\Models\Place;
use App\Models\Review;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_places' => Place::count(),
            'total_users' => User::count(),
            'total_categories' => Category::count(),
            'pending_requests' => ExplorationRequest::where(
                'status',
                'pending'
            )->count(),
            'pending_reviews' => Review::where(
                'status',
                'pending'
            )->count(),
            'active_places' => Place::where(
                'status',
                'active'
            )->count(),
        ]);
    }
}