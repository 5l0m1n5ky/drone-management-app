<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UpdatePostTest extends TestCase
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
    public function successful_post_update(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

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

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/api/posts/update/' . $post->id, [
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        Post::find($post->id)->delete();

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
        Storage::disk('public')->assertExists('posts/covers/' . $cover->hashName());

        Storage::disk('public')->delete('posts/' . $file->hashName());
        Storage::disk('public')->delete('posts/covers/' . $cover->hashName());
    }

    /** @test */
    public function unsuccessful_post_update(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $file = UploadedFile::fake()->image('post-file.jpg');
        $cover = UploadedFile::fake()->image('post-cover.jpg');

        $filePath = Storage::disk('public')->putFile('/api/posts', $file);
        $coverPath = Storage::disk('public')->putFile('/api/posts/covers', $cover);

        $post = Post::create([
            'path' => $filePath,
            'cover' => $coverPath,
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $newFile = UploadedFile::fake()->image('new-post-file.jpg')->size(15000);
        $newCover = UploadedFile::fake()->image('new-post-cover.jpg')->size(15000);

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/api/posts/update/' . $post->id, [
            'file' => $newFile,
            'cover' => $newCover,
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $post = Post::find($post->id);

        $newFilePath = Str::replace('http://127.0.0.1:8000/storage', 'public', $post->path);
        $newCoverPath = Str::replace('http://127.0.0.1:8000/storage', 'public', $post->cover);

        Storage::disk('public')->assertExists($newFilePath);
        Storage::disk('public')->assertExists($newCoverPath);

        Storage::disk('public')->delete($newFilePath);
        Storage::disk('public')->delete($newCoverPath);

        $post->delete();
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
    public function unauthorized_post_update(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->make(['role' => 'user']);

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

        $response = $this->actingAs($user)->withSession(['banned' => false])->post('/api/posts/update/' . $post->id, [
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $response->assertStatus(401)->assertJsonStructure([
            'data',
        ]);

        Post::find($post->id)->delete();

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
        Storage::disk('public')->assertExists('posts/covers/' . $cover->hashName());

        Storage::disk('public')->delete('posts/' . $file->hashName());
        Storage::disk('public')->delete('posts/covers/' . $cover->hashName());
    }

    /** @test */
    public function nonexisting_post_update(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

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

        $response = $this->actingAs($admin)->withSession(['banned' => false])->postJson('/api/posts/update/' . $this->generateUniqueId(), [
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $response->assertStatus(500)->assertJsonStructure([
            'data',
            'message'
        ]);

        Post::find($post->id)->delete();

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
        Storage::disk('public')->assertExists('posts/covers/' . $cover->hashName());

        Storage::disk('public')->delete('posts/' . $file->hashName());
        Storage::disk('public')->delete('posts/covers/' . $cover->hashName());
    }

    // /** @test */
    // public function check_csrf_protection(): void
    // {
    //     $admin = User::factory()->make(['role' => 'admin']);

    //     $file = UploadedFile::fake()->image('post-file.jpg');
    //     $cover = UploadedFile::fake()->image('post-cover.jpg');

    //     $filePath = Storage::putFile('public/posts', $file);
    //     $coverPath = Storage::putFile('public/posts/covers', $cover);

    //     $post = Post::create([
    //         'path' => $filePath,
    //         'cover' => $coverPath,
    //         'location' => fake()->city(),
    //         'description' => fake()->text(200),
    //         'visibility' => true
    //     ]);

    //     $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/api/posts/update/' . $post->id, [
    //         'location' => fake()->city(),
    //         'description' => fake()->text(200),
    //         'visibility' => true
    //     ]);

    //     $response->assertStatus(500)->assertJsonStructure([
    //         'message'
    //     ]);

    //     Post::find($post->id)->delete();

    //     Storage::disk('public')->assertExists('posts/' . $file->hashName());
    //     Storage::disk('public')->assertExists('posts/covers/' . $cover->hashName());

    //     Storage::disk('public')->delete('posts/' . $file->hashName());
    //     Storage::disk('public')->delete('posts/covers/' . $cover->hashName());
    // }
}
