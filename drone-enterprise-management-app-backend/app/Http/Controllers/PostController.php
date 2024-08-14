<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Http\Requests\ValidatePostRequest;
use App\Http\Requests\ValidatePostUpdateRequest;
use Illuminate\Validation\ValidationException;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;



class PostController extends Controller
{

    use HttpResponses;
    public function index()
    {
        // $posts = DB::table('posts')->get();
        $posts = DB::table('posts')->orderBy('id')->get();

        return response()->json($posts);
    }

    public function store(ValidatePostRequest $request)
    {
        error_log($request);

        $request->validated($request->all());

        $file = $request->file('file');
        $urToStore = 'public/posts';
        $path = Str::replace('public/', '', env('APP_ADDRESS') . '/storage' . '/' . Storage::putFile($urToStore, $file));

        $post = Post::create([
            'path' => $path,
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
            'PUBLISHED',
            200
        );
    }

    public function update(ValidatePostUpdateRequest $request, $post_id)
    {
        $request->validated($request->all());

        $post = Post::find($post_id);
        $post_filepath = $post->file;

        if ($request->hasFile('file')) {

            $post_filepath = $post->path;
            $post_filename = Str::replace('http://127.0.0.1:8000/storage', 'public', $post_filepath);

            if (Storage::exists($post_filename)) {
                Storage::delete($post_filename);
            }

            $file = $request->file('file');
            $urToStore = 'public/posts';
            $path = Str::replace('public/', '', env('APP_ADDRESS') . '/storage' . '/' . Storage::putFile($urToStore, $file));

            $post->update([
                'path' => $path,
                'location' => $request->location,
                'description' => $request->description,
                'visibility' => $request->visibility,
            ]);

        } else {
            $post->update([
                'location' => $request->location,
                'description' => $request->description,
                'visibility' => $request->visibility,
            ]);
        }

        return $this->success(
            'Post is succesuffly edited',
            'UPDATED',
            200
        );
    }

    public function delete($post_id)
    {
        $post = Post::find($post_id);

        if ($post) {

            $post_filepath = $post->path;
            $post_filename = Str::replace('http://127.0.0.1:8000/storage', 'public', $post_filepath);

            if (Storage::exists($post_filename)) {
                Storage::delete($post_filename);
            }

            $post->delete();

            return $this->success(
                'Post is succesuffly deleted',
                'DELETED_SUCCESFULLY',
                200
            );
        } else {
            return $this->error(
                'No such post to delete or internal error',
                'CANNOT_DELETE',
                500
            );
        }
    }
}
