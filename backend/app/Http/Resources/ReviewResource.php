<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'status' => $this->status,

            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),

            'place' => $this->whenLoaded('place', fn () => [
                'id' => $this->place->id,
                'name' => $this->place->name,
            ]),

            'created_at' => $this->created_at,
        ];
    }
}
