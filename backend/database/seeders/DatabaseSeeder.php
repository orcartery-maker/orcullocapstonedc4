<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ExplorationRequest;
use App\Models\Favorite;
use App\Models\Place;
use App\Models\Region;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'GeoSystem Administrator',
            'email' => 'admin@geosystem.test',
            'password' => 'password',
        ]);

        $user = User::factory()->create([
            'name' => 'GeoSystem User',
            'email' => 'user@geosystem.test',
            'password' => 'password',
        ]);

        Region::factory(6)->create();

        Category::factory(8)->create();

        Place::factory(25)->create();

        Review::factory(20)->create([
            'status' => 'approved',
        ]);

        ExplorationRequest::factory(15)->create();

        Favorite::factory(15)->create();
    }
}