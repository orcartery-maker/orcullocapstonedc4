<?php

namespace Tests\Feature;

use App\Models\ExplorationRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExplorationRequestAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_requests_from_every_user_and_can_filter(): void
    {
        ExplorationRequest::factory()->count(2)->create(['status' => 'pending']);
        ExplorationRequest::factory()->count(3)->create(['status' => 'approved']);

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/exploration-requests')
            ->assertOk()
            ->assertJsonPath('total', 5)
            ->assertJsonStructure(['data' => [['id', 'status', 'user' => ['name'], 'place' => ['name']]]]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/exploration-requests?status=pending')
            ->assertOk()
            ->assertJsonPath('total', 2);
    }

    public function test_regular_users_cannot_use_the_admin_list(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/admin/exploration-requests')
            ->assertForbidden();
    }
}
