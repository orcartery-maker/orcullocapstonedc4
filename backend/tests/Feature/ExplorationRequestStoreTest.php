<?php

namespace Tests\Feature;

use App\Models\ExplorationRequest;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExplorationRequestStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_second_pending_request_for_the_same_place_is_rejected(): void
    {
        $user = User::factory()->create();
        $place = Place::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/exploration-request", ['message' => 'First'])
            ->assertCreated();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/exploration-request", ['message' => 'Again'])
            ->assertUnprocessable();

        $this->assertDatabaseCount('exploration_requests', 1);
    }

    public function test_a_new_request_is_allowed_once_the_earlier_one_is_resolved(): void
    {
        $user = User::factory()->create();
        $place = Place::factory()->create();

        ExplorationRequest::factory()->create([
            'user_id' => $user->id,
            'place_id' => $place->id,
            'status' => 'completed',
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/exploration-request")
            ->assertCreated();
    }

    public function test_inactive_places_cannot_be_requested(): void
    {
        $place = Place::factory()->create(['status' => 'inactive']);

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson("/api/places/{$place->id}/exploration-request")
            ->assertNotFound();
    }
}
