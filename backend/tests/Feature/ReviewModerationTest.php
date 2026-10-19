<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewModerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_and_filter_reviews(): void
    {
        Review::factory()->count(2)->create(['status' => 'pending']);
        Review::factory()->count(3)->create(['status' => 'approved']);

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/reviews')
            ->assertOk()
            ->assertJsonCount(5, 'data');

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/reviews?status=pending')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_approve_a_review(): void
    {
        $review = Review::factory()->create(['status' => 'pending']);

        $this->actingAs(User::factory()->admin()->create(), 'sanctum')
            ->patchJson("/api/reviews/{$review->id}/status", ['status' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertSame('approved', $review->fresh()->status);
    }

    public function test_invalid_status_is_rejected(): void
    {
        $review = Review::factory()->create();

        $this->actingAs(User::factory()->admin()->create(), 'sanctum')
            ->patchJson("/api/reviews/{$review->id}/status", ['status' => 'banana'])
            ->assertUnprocessable();
    }

    public function test_regular_users_cannot_moderate(): void
    {
        $review = Review::factory()->create(['status' => 'pending']);
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/admin/reviews')
            ->assertForbidden();

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/reviews/{$review->id}/status", ['status' => 'approved'])
            ->assertForbidden();

        $this->assertSame('pending', $review->fresh()->status);
    }
}
