<?php

namespace Tests\Feature;

use App\Models\ExplorationRequest;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_user_can_submit_and_list_exploration_requests(): void
    {
        $user = User::factory()->create();
        $place = Place::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/places/{$place->id}/exploration-request", ['message' => 'Hi'])
            ->assertCreated();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/exploration-requests')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_only_admin_can_change_exploration_request_status(): void
    {
        $request = ExplorationRequest::factory()->create(['status' => 'pending']);

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->patchJson("/api/exploration-requests/{$request->id}/status", ['status' => 'approved'])
            ->assertForbidden();

        $this->actingAs(User::factory()->admin()->create(), 'sanctum')
            ->patchJson("/api/exploration-requests/{$request->id}/status", ['status' => 'approved'])
            ->assertOk();
    }

    public function test_dashboard_is_admin_only(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/dashboard')
            ->assertForbidden();

        $this->actingAs(User::factory()->admin()->create(), 'sanctum')
            ->getJson('/api/dashboard')
            ->assertOk();
    }

    public function test_inactive_places_are_hidden_from_non_admins(): void
    {
        $active = Place::factory()->create(['status' => 'active']);
        $inactive = Place::factory()->create(['status' => 'inactive']);

        $this->getJson('/api/places')->assertJsonCount(1, 'data');
        $this->getJson("/api/places/{$active->id}")->assertOk();
        $this->getJson("/api/places/{$inactive->id}")->assertNotFound();

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/places')
            ->assertJsonCount(2, 'data');
        $this->actingAs($admin, 'sanctum')
            ->getJson("/api/places/{$inactive->id}")
            ->assertOk();
    }

    public function test_place_details_report_favorite_state_for_the_logged_in_user(): void
    {
        $user = User::factory()->create();
        $place = Place::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/places/{$place->id}")
            ->assertJsonPath('data.is_favorite', false);

        $this->actingAs($user, 'sanctum')->postJson("/api/places/{$place->id}/favorite");

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/places/{$place->id}")
            ->assertJsonPath('data.is_favorite', true);
    }

    public function test_registration_returns_a_token(): void
    {
        $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'new@example.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertCreated()->assertJsonStructure(['user', 'token']);
    }
}
