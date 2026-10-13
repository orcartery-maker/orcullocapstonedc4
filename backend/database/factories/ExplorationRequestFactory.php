<?php

namespace Database\Factories;

use App\Models\Place;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExplorationRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'place_id' => Place::factory(),
            'message' => fake()->sentence(15),
            'status' => fake()->randomElement([
                'pending',
                'approved',
                'completed',
                'rejected',
            ]),
        ];
    }
}