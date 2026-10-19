<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Region;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_names_must_be_unique(): void
    {
        $admin = User::factory()->admin()->create();
        Category::factory()->create(['name' => 'Beach']);

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/categories', ['name' => 'Beach'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/categories', ['name' => 'Waterfall'])
            ->assertCreated();
    }

    public function test_region_names_must_be_unique(): void
    {
        $admin = User::factory()->admin()->create();
        Region::factory()->create(['name' => 'Luzon']);

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/regions', ['name' => 'Luzon'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_an_item_can_be_updated_without_changing_its_name(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create(['name' => 'Beach']);
        $region = Region::factory()->create(['name' => 'Luzon']);

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/categories/{$category->id}", ['name' => 'Beach', 'description' => 'Sand'])
            ->assertOk();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/regions/{$region->id}", ['name' => 'Luzon', 'description' => 'North'])
            ->assertOk();
    }

    public function test_renaming_to_another_existing_name_is_rejected(): void
    {
        $admin = User::factory()->admin()->create();
        Category::factory()->create(['name' => 'Beach']);
        $mountain = Category::factory()->create(['name' => 'Mountain']);

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/categories/{$mountain->id}", ['name' => 'Beach'])
            ->assertUnprocessable();
    }
}
