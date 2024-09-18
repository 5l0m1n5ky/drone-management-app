<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class UpdatePostTest extends TestCase
{

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

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/posts/update/' . $post->id, [
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

        $filePath = Storage::putFile('public/posts', $file);
        $coverPath = Storage::putFile('public/posts/covers', $cover);

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

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/posts/update/' . $post->id, [
            'file' => $newFile,
            'cover' => $newCover,
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
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
            'file' => ['The file field must not be greater than 51200 kilobytes.'],
            'cover' => ['The cover field must not be greater than 51200 kilobytes.'],
            'location' => ['The location field is required.'],
            'description' => ['The description field is required.'],
            'visibility' => ['The visibility field is required.'],
        ]);

        Post::find($post->id)->delete();

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
        Storage::disk('public')->assertExists('posts/covers/' . $cover->hashName());

        Storage::disk('public')->delete('posts/' . $file->hashName());
        Storage::disk('public')->delete('posts/covers/' . $cover->hashName());
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

        $response = $this->actingAs($user)->withSession(['banned' => false])->post('/posts/update/' . $post->id, [
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

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/posts/update/' . $this->generateUniqueId(), [
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

    public function check_csrf_protection(): void
    {
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

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/posts/update/' . $post->id, [
            'location' => fake()->city(),
            'description' => fake()->text(200),
            'visibility' => true
        ]);

        $response->assertStatus(500)->assertJsonStructure([
            'message'
        ]);

        Post::find($post->id)->delete();

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
        Storage::disk('public')->assertExists('posts/covers/' . $cover->hashName());

        Storage::disk('public')->delete('posts/' . $file->hashName());
        Storage::disk('public')->delete('posts/covers/' . $cover->hashName());
    }


}
