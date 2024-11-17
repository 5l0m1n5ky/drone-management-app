<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreatePostTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function successfull_creating_post_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $file = UploadedFile::fake()->image('post-file.jpg');

        $cover = UploadedFile::fake()->image('post-cover.jpg');

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/posts', [
            'file' => $file->size(1000),
            'cover' => $cover->size(1000),
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        Post::latest('created_at')->first()->delete();

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
        Storage::disk('public')->assertExists('posts/covers/' . $cover->hashName());

        Storage::disk('public')->delete('posts/' . $file->hashName());
        Storage::disk('public')->delete('posts/covers/' . $cover->hashName());

    }

    /** @test */
    public function unsuccessfull_creating_post_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $file = UploadedFile::fake()->image('post-file.jpg');

        $cover = UploadedFile::fake()->image('post-cover.jpg');

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/posts', [
            'file' => $file->size(15000),
            'cover' => $cover->size(15000),
            'location' => null,
            'description' => null,
            'visibility' => null
        ]);

        $response->assertStatus(302);

        $response->assertJsonStructure([
            'message',
            'errors' => [
                'file',
                'cover',
                'location',
                'description',
                'visibility'
            ],
        ]);

        $response->assertJsonFragment([
            'file' => ['The file field must not be greater than 10000 kilobytes.'],
            'cover' => ['The cover field must not be greater than 10000 kilobytes.'],
            'location' => ['The location field is required.'],
            'description' => ['The description field is required.'],
            'visibility' => ['The visibility field is required.'],
        ]);
    }

    /** @test */
    public function creating_post_attempt_by_user_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->make(['role' => 'user']);

        $file = UploadedFile::fake()->image('post-file.jpg');

        $cover = UploadedFile::fake()->image('post-cover.jpg');

        $response = $this->actingAs($user)->withSession(['banned' => false])->post('/posts', [
            'file' => $file->size(1000),
            'cover' => $cover->size(1000),
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $response->assertStatus(401)->assertJsonStructure([
            'data',
            'message'
        ]);
    }

    /** @test */
    public function check_csrf_protection(): void
    {
        $user = User::factory()->make(['role' => 'user']);

        $file = UploadedFile::fake()->image('post-file.jpg');

        $cover = UploadedFile::fake()->image('post-cover.jpg');

        $response = $this->actingAs($user)->withSession(['banned' => false])->post('/posts', [
            'file' => $file->size(1000),
            'cover' => $cover->size(1000),
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $response->assertStatus(500)->assertJsonStructure([
            'message'
        ]);
    }
}
