<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Category::latest()->get()
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
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')],
            'description' => ['nullable', 'string'],
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin access required.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated.',
            'data' => $category,
        ]);
    }

    public function destroy(Request $request, Category $category)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin access required.'
            ], 403);
        }

        if ($category->places()->exists()) {
            return response()->json([
                'message' =>
                    'Cannot delete a category that has places.'
            ], 422);
        }

        $category->delete();

        return response()->json(null, 204);
    }
}