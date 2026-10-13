<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RegionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement([
                'Central Visayas',
                'Western Visayas',
                'Eastern Visayas',
                'Northern Mindanao',
                'Central Luzon',
                'CALABARZON',
            ]),
            'description' => fake()->sentence(12),
        ];
    }
}