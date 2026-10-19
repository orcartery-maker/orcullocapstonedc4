<?php

namespace Tests\Feature;

use App\Models\Place;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_review(): void
    {
        $place = Place::factory()->create();

        $this->postJson("/api/places/{$place->id}/reviews", ['rating' => 5, 'comment' => 'Nice'])
            ->assertUnauthorized();
    }

    public function test_a_user_can_submit_a_review_that_starts_pending(): void
    {
        $user = User::factory()->create();
        $place = Place::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/reviews", ['rating' => 4, 'comment' => 'Lovely beach'])
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.rating', 4);

        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'place_id' => $place->id,
            'status' => 'pending',
        ]);
    }

    public function test_rating_and_comment_are_validated(): void
    {
        $user = User::factory()->create();
        $place = Place::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/reviews", ['rating' => 9, 'comment' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['rating', 'comment']);
    }

    public function test_a_user_can_review_a_place_only_once(): void
    {
        $user = User::factory()->create();
        $place = Place::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/reviews", ['rating' => 5, 'comment' => 'First'])
            ->assertCreated();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/reviews", ['rating' => 1, 'comment' => 'Second'])
            ->assertUnprocessable();

        $this->assertDatabaseCount('reviews', 1);
    }

    public function test_inactive_places_cannot_be_reviewed(): void
    {
        $place = Place::factory()->create(['status' => 'inactive']);

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson("/api/places/{$place->id}/reviews", ['rating' => 5, 'comment' => 'Hi'])
            ->assertNotFound();
    }

    public function test_users_only_see_their_own_reviews(): void
    {
        $user = User::factory()->create();
        Review::factory()->count(2)->create(['user_id' => $user->id]);
        Review::factory()->count(3)->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/reviews')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_only_the_author_or_an_admin_can_delete_a_review(): void
    {
        $review = Review::factory()->create();

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->deleteJson("/api/reviews/{$review->id}")
            ->assertForbidden();

        $this->actingAs($review->user, 'sanctum')
            ->deleteJson("/api/reviews/{$review->id}")
            ->assertNoContent();

        $other = Review::factory()->create();
        $this->actingAs(User::factory()->admin()->create(), 'sanctum')
            ->deleteJson("/api/reviews/{$other->id}")
            ->assertNoContent();
    }
}
