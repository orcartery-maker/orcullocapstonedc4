
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExplorationRequestController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public browsing routes
Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{place}', [PlaceController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/regions', [RegionController::class, 'index']);

// Routes requiring authentication
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/places/{place}/favorite', [FavoriteController::class, 'store']);
    Route::delete('/places/{place}/favorite', [FavoriteController::class, 'destroy']);

    // Reviews (any authenticated user)
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/places/{place}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Exploration requests (any authenticated user)
    Route::get('/exploration-requests', [ExplorationRequestController::class, 'index']);
    Route::post('/places/{place}/exploration-request', [ExplorationRequestController::class, 'store']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

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

        // Moderate reviews
        Route::get('/admin/reviews', [ReviewController::class, 'adminIndex']);
        Route::patch('/reviews/{review}/status', [ReviewController::class, 'updateStatus']);

        // Manage exploration requests
        Route::get('/admin/exploration-requests', [ExplorationRequestController::class, 'adminIndex']);
        Route::patch('/exploration-requests/{explorationRequest}/status', [
            ExplorationRequestController::class,
            'updateStatus',
        ]);
    });
});
