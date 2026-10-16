<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Beach',
                'Mountain',
                'Nature',
                'Historical',
                'Cultural',
                'Waterfall',
                'Island',
                'Adventure',
            ]),
            'description' => fake()->sentence(10),
        ];
    }
}