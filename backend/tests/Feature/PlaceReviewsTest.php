<?php

namespace Tests\Feature;

use App\Models\Place;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlaceReviewsTest extends TestCase
{
    use RefreshDatabase;

    public function test_place_details_include_only_approved_reviews_and_the_average(): void
    {
        $place = Place::factory()->create();

        Review::factory()->create(['place_id' => $place->id, 'rating' => 5, 'status' => 'approved']);
        Review::factory()->create(['place_id' => $place->id, 'rating' => 4, 'status' => 'approved']);
        Review::factory()->create(['place_id' => $place->id, 'rating' => 1, 'status' => 'pending']);
        Review::factory()->create(['place_id' => $place->id, 'rating' => 1, 'status' => 'rejected']);

        $this->getJson("/api/places/{$place->id}")
            ->assertOk()
            ->assertJsonPath('data.reviews_count', 2)
            ->assertJsonPath('data.average_rating', 4.5)
            ->assertJsonCount(2, 'data.reviews')
            ->assertJsonPath('data.reviews.0.user.name', fn ($name) => is_string($name));
    }

    public function test_a_place_without_reviews_has_no_average(): void
    {
        $place = Place::factory()->create();

        $this->getJson("/api/places/{$place->id}")
            ->assertOk()
            ->assertJsonPath('data.reviews_count', 0)
            ->assertJsonPath('data.average_rating', null);
    }

    public function test_the_place_list_does_not_load_reviews(): void
    {
        Place::factory()->create();

        $this->getJson('/api/places')
            ->assertOk()
            ->assertJsonMissingPath('data.0.reviews')
            ->assertJsonMissingPath('data.0.average_rating');
    }
}
