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

        $regionMap = collect([
            'Luzon' => Region::firstOrCreate([
                'name' => 'Luzon',
            ], [
                'description' => 'The largest island group in the Philippines, known for historic cities, volcanoes, and mountain landscapes.',
            ]),
            'Visayas' => Region::firstOrCreate([
                'name' => 'Visayas',
            ], [
                'description' => 'A central island group famous for beaches, festivals, and island-hopping adventures.',
            ]),
            'Mindanao' => Region::firstOrCreate([
                'name' => 'Mindanao',
            ], [
                'description' => 'A southern island region with dramatic coastlines, volcanic scenery, and rich cultural heritage.',
            ]),
            'Palawan' => Region::firstOrCreate([
                'name' => 'Palawan',
            ], [
                'description' => 'An island province celebrated for limestone cliffs, turquoise lagoons, and secluded beaches.',
            ]),
            'Bicol' => Region::firstOrCreate([
                'name' => 'Bicol',
            ], [
                'description' => 'A region recognized for Mayon Volcano, coastal towns, and flavorful regional cuisine.',
            ]),
        ])->mapWithKeys(fn ($region) => [$region->name => $region]);

        $categoryMap = collect([
            'Beach' => Category::firstOrCreate([
                'name' => 'Beach',
            ], [
                'description' => 'Sunny shores, calm coves, and island beaches.',
            ]),
            'Mountain' => Category::firstOrCreate([
                'name' => 'Mountain',
            ], [
                'description' => 'Highland adventures and scenic trekking destinations.',
            ]),
            'Waterfall' => Category::firstOrCreate([
                'name' => 'Waterfall',
            ], [
                'description' => 'Freshwater falls and jungle cascades.',
            ]),
            'Historical' => Category::firstOrCreate([
                'name' => 'Historical',
            ], [
                'description' => 'Places rich in heritage, colonial history, and cultural narratives.',
            ]),
            'Island' => Category::firstOrCreate([
                'name' => 'Island',
            ], [
                'description' => 'Remote island destinations and tropical escapes.',
            ]),
            'Adventure' => Category::firstOrCreate([
                'name' => 'Adventure',
            ], [
                'description' => 'Thrilling activities and outdoor experiences.',
            ]),
            'Nature' => Category::firstOrCreate([
                'name' => 'Nature',
            ], [
                'description' => 'Protected landscapes, forests, and natural wonders.',
            ]),
            'Cultural' => Category::firstOrCreate([
                'name' => 'Cultural',
            ], [
                'description' => 'Heritage-rich communities and unforgettable traditions.',
            ]),
        ])->mapWithKeys(fn ($category) => [$category->name => $category]);

        $destinations = [
            [
                'name' => 'Banaue Rice Terraces',
                'region' => 'Luzon',
                'category' => 'Cultural',
                'location' => 'Banaue, Ifugao',
                'latitude' => 16.9246,
                'longitude' => 121.0625,
                'description' => 'Ancient terraces carved into the mountains, recognized as one of the Philippines\' most iconic heritage landscapes.',
            ],
            [
                'name' => 'Mayon Volcano',
                'region' => 'Bicol',
                'category' => 'Nature',
                'location' => 'Legazpi, Albay',
                'latitude' => 13.2575,
                'longitude' => 123.6854,
                'description' => 'One of the world\'s most perfectly shaped volcanoes, offering dramatic views and breathtaking scenery.',
            ],
            [
                'name' => 'El Nido',
                'region' => 'Palawan',
                'category' => 'Island',
                'location' => 'El Nido, Palawan',
                'latitude' => 11.2050,
                'longitude' => 119.4178,
                'description' => 'A postcard-perfect island escape known for limestone cliffs, clear lagoons, and unforgettable island hopping.',
            ],
            [
                'name' => 'Boracay',
                'region' => 'Visayas',
                'category' => 'Beach',
                'location' => 'Boracay Island, Aklan',
                'latitude' => 11.9674,
                'longitude' => 121.9248,
                'description' => 'Famous for powdery white sand beaches, vibrant nightlife, and lively sunset spots.',
            ],
            [
                'name' => 'Chocolate Hills',
                'region' => 'Visayas',
                'category' => 'Nature',
                'location' => 'Bohol',
                'latitude' => 9.8246,
                'longitude' => 124.1431,
                'description' => 'A remarkable geological formation of cone-shaped hills that turn brown during the dry season.',
            ],
            [
                'name' => 'Siargao',
                'region' => 'Mindanao',
                'category' => 'Adventure',
                'location' => 'Siargao Island, Surigao del Norte',
                'latitude' => 9.8486,
                'longitude' => 125.9657,
                'description' => 'Renowned for surf breaks, island hopping, and a laid-back island lifestyle.',
            ],
            [
                'name' => 'Intramuros',
                'region' => 'Luzon',
                'category' => 'Historical',
                'location' => 'Manila, Metro Manila',
                'latitude' => 14.5903,
                'longitude' => 120.9750,
                'description' => 'The historic walled district of Manila, filled with Spanish-era churches, forts, and cobbled streets.',
            ],
            [
                'name' => 'Taal Volcano',
                'region' => 'Luzon',
                'category' => 'Nature',
                'location' => 'Tagaytay, Batangas',
                'latitude' => 13.9926,
                'longitude' => 120.9932,
                'description' => 'A famous active volcano with a scenic crater lake and unforgettable panoramic views.',
            ],
            [
                'name' => 'Hundred Islands',
                'region' => 'Luzon',
                'category' => 'Island',
                'location' => 'Alaminos, Pangasinan',
                'latitude' => 16.1955,
                'longitude' => 119.9483,
                'description' => 'A protected island group known for pocket beaches, snorkeling, and boat tours across turquoise water.',
            ],
            [
                'name' => 'Mount Pulag',
                'region' => 'Luzon',
                'category' => 'Mountain',
                'location' => 'Buguias, Benguet',
                'latitude' => 16.5904,
                'longitude' => 120.8742,
                'description' => 'The third highest mountain in the Philippines, celebrated for sea of clouds, trails, and sunrise views.',
            ],
        ];

        foreach ($destinations as $destination) {
            Place::firstOrCreate([
                'name' => $destination['name'],
            ], [
                'region_id' => $regionMap[$destination['region']]->id,
                'category_id' => $categoryMap[$destination['category']]->id,
                'description' => $destination['description'],
                'location' => $destination['location'],
                'latitude' => $destination['latitude'],
                'longitude' => $destination['longitude'],
                'image' => null,
                'status' => 'active',
            ]);
        }

        Review::factory(20)->create([
            'status' => 'approved',
        ]);

        ExplorationRequest::factory(15)->create();

        Favorite::factory(15)->create();
    }
}