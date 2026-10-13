<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlaceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'region_id' => Region::factory(),
            'category_id' => Category::factory(),

            'name' => fake()->unique()->city() . ' Destination',

            'description' => fake()->paragraph(3),

            'location' => fake()->city() . ', Philippines',

            'latitude' => fake()->latitude(4, 21),

            'longitude' => fake()->longitude(116, 127),

            'image' => null,

            'status' => 'active',
        ];
    }
}