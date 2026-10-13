
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\RegionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExplorationRequestController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes requiring authentication
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Places
    Route::get('/places', [PlaceController::class, 'index']);
    Route::get('/places/{place}', [PlaceController::class, 'show']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);

    // Regions
    Route::get('/regions', [RegionController::class, 'index']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/places/{place}/favorite', [FavoriteController::class, 'store']);
    Route::delete('/places/{place}/favorite', [FavoriteController::class, 'destroy']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {

        // Manage places
        Route::post('/places', [PlaceController::class, 'store']);
        Route::put('/places/{place}', [PlaceController::class, 'update']);
        Route::delete('/places/{place}', [PlaceController::class, 'destroy']);

        Route::patch('/places/{place}/status', [
            PlaceController::class,
            'changeStatus',
        ]);

        // Manage categories
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Manage regions
        Route::post('/regions', [RegionController::class, 'store']);
        Route::put('/regions/{region}', [RegionController::class, 'update']);
        Route::delete('/regions/{region}', [RegionController::class, 'destroy']);

        Route::get('/exploration-requests', [
    ExplorationRequestController::class,
    'index'
]);

Route::post('/places/{place}/exploration-request', [
    ExplorationRequestController::class,
    'store'
]);

Route::patch(
    '/exploration-requests/{explorationRequest}/status',
    [
        ExplorationRequestController::class,
        'updateStatus'
    ]
)->middleware('admin');
    });
});
