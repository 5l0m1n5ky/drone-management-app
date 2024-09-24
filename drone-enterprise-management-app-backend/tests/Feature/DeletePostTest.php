<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DeletePostTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    function generateUniqueId()
    {
        do {
            $id = random_int(1, 999);
        } while (Post::where('id', $id)->exists());

        return $id;
    }

    /** @test */
    public function succesful_post_delete_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $file = UploadedFile::fake()->image('post-file.jpg');
        $cover = UploadedFile::fake()->image('post-cover.jpg');

        $filePath = Storage::putFile('public/posts', $file);
        $coverPath = Storage::putFile('public/posts/covers', $cover);

        $post = Post::create([
            'path' => $filePath,
            'cover' => $coverPath,
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $admin = User::factory()->make(['role' => 'admin']);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->delete('/posts/delete/' . $post->id);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        Storage::disk('public')->assertMissing('posts/' . $file->hashName());
        Storage::disk('public')->assertMissing('posts/covers/' . $cover->hashName());
    }

    /** @test */
    public function nonexisting_post_delete_attempt_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->delete('/posts/delete/' . $this->generateUniqueId());

        $response->assertStatus(500)->assertJsonStructure([
            'data',
            'message'
        ]);
    }

    /** @test */
    public function unauthenticated_post_delete_attempt_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->make(['role' => 'user']);

        $response = $this->actingAs($user)->withSession(['banned' => false])->delete('/posts/delete/' . $this->generateUniqueId());

        $response->assertStatus(401)->assertJsonStructure([
            'data',
            'message'
        ]);
    }

    /** @test */
    public function check_csrf_protection(): void
    {
        $this->assertGuest('web');

        $response = $this->delete('/posts/delete/' . $this->generateUniqueId());

        $response->assertStatus(500)->assertJsonStructure([
            'message'
        ]);
    }
}
