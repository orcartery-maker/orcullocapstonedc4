<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'location' => $this->location,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'image' => $this->image,
            'status' => $this->status,

            'is_favorite' => $this->when(
                array_key_exists('is_favorite', $this->resource->getAttributes()),
                fn () => (bool) $this->resource->getAttribute('is_favorite')
            ),

            'region' => [
                'id' => $this->region?->id,
                'name' => $this->region?->name,
            ],

            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ],

            'created_at' => $this->created_at,
        ];
    }
}