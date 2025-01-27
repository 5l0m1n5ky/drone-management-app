<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Http\Requests\ValidatePostRequest;
use App\Http\Requests\ValidatePostUpdateRequest;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{

    use HttpResponses;

    public function index()
    {
        $posts = Post::orderBy('id')->get();

        return response()->json($posts);
    }

    public function store(ValidatePostRequest $request)
    {
        $request->validated($request->all());

        $file = $request->file('file');
        $urToStore = 'public/posts';
        $path = Str::replace('public/', '', env('APP_ADDRESS') . '/storage' . '/' . Storage::putFile($urToStore, $file));
        $cover = null;

        if ($request->hasFile('cover')) {
            $coverFile = $request->file('cover');
            $urToStoreCover = 'public/posts/covers';
            $cover = Str::replace('public/', '', env('APP_ADDRESS') . '/storage' . '/' . Storage::putFile($urToStoreCover, $coverFile));
        }

        $post = Post::create([
            'path' => $path,
            'cover' => $cover,
            'location' => $request->location,
            'description' => $request->description,
            'visibility' => $request->visibility,
        ]);

        return $this->success(
            [
                'post' => [
                    'post_id' => $post->id
                ],
            ],
            'Opublikowano post',
            200
        );
    }

    public function update(ValidatePostUpdateRequest $request, $post_id)
    {
        $request->validated($request->all());

        $post = Post::find($post_id);

        if ($post) {

            $path = $post->path;
            $cover = $post->cover;

            if ($request->hasFile('file')) {

                $post_filepath = $post->path;
                $post_filename = Str::replace('/storage', '', $post_filepath);

                if (Storage::disk('public')->exists($post_filename)) {
                    Storage::disk('public')->delete($post_filename);
                }

                $file = $request->file('file');
                $urToStore = 'public/posts';
                $path = Str::replace('public/', '', env('APP_ADDRESS') . '/storage' . '/' . Storage::putFile($urToStore, $file));
            }

            if ($request->hasFile('cover')) {

                $cover_filepath = $post->cover;
                $cover_filename = Str::replace('/storage', '', $cover_filepath);

                if (Storage::disk('public')->exists($cover_filename)) {
                    Storage::disk('public')->delete($cover_filename);
                }

                $coverFile = $request->file('cover');
                $urToStore = 'public/posts/covers';
                $cover = Str::replace('public/', '', env('APP_ADDRESS') . '/storage' . '/' . Storage::putFile($urToStore, $coverFile));
            }

            $visibility = env('APP_ENV') === 'local'
                ? ($request->visibility === 'true' ? 1 : 0)
                : $request->visibility;

            $post->update([
                'path' => $path,
                'cover' => $cover,
                'location' => $request->location,
                'description' => $request->description,
                'visibility' => $visibility,
            ]);

            return $this->success(
                'UPDATED',
                'Post został zaktualizowany',
                200
            );
        } else {
            return $this->error(
                'NO_SUCH_POST_TO_UPATE',
                'Post nie istnieje',
                500
            );
        }
    }

    public function delete($post_id)
    {
        $post = Post::find($post_id);

        if ($post) {

            $post_filepath = $post->path;
            $post_filename = Str::replace('http://127.0.0.1:8000/storage', 'public', $post_filepath);

            $post_coverpath = $post->cover;
            $post_covername = Str::replace('http://127.0.0.1:8000/storage', 'public', $post_coverpath);

            if (Storage::exists($post_filename)) {
                Storage::delete($post_filename);
            }

            if (Storage::exists($post_covername)) {
                Storage::delete($post_covername);
            }

            $post->delete();

            return $this->success(
                'DELETED_SUCCESFULLY',
                'Pomyślnie usunięto post',
                200
            );
        } else {
            return $this->error(
                'CANNOT_DELETE',
                'Błąd przetwarzania żądania',
                500
            );
        }
    }
}
