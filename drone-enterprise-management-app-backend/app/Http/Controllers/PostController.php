<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Http\Requests\ValidatePostRequest;
use Illuminate\Validation\ValidationException;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Storage;


class PostController extends Controller
{

    use HttpResponses;
    public function index()
    {
        $posts = DB::table('posts')->get();

        return response()->json($posts);

    }

    public function store(ValidatePostRequest $request)
    {
        $request->validated($request->all());

        // $request = $request->validate([
        //     'file' => ['required', 'mimes:png,jpg,jpeg,mp4,mov', 'max:10000'],
        //     'location' => ['required', 'string', 'max:50'],
        //     'description' => ['required', 'string', 'max:500'],
        //     'visibility' => ['required']
        // ]);

        $file = $request->file('file');
        $path = env('APP_ADDRESS') . '/storage' . '/' . $file->store('posts', 'public');

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

    public function update(ValidatePostRequest $request, $post_id)
    {
        $request->validated($request->all());

        $post = Post::find($post_id);
        $post_filepath = $post->file;

        if ($post_filepath == (env('APP_ADDRESS') . '/storage' . '/' . $request->file('file')->getClientOriginalName())) {
            Storage::delete($post_filepath);
        }

        $file = $request->file('file');
        $path = env('APP_ADDRESS') . '/storage' . '/' . $file->store('posts', 'public');

        $post = Post::update([
            'path' => $path,
            'location' => $request->location,
            'description' => $request->description,
            'visibility' => $request->visibility,
        ]);

        return $this->success(
            'Post is succesuffly edited',
            'UPDATED',
            200
        );
    }

    public function delete(Request $request, $post_id)
    {
        $post = Post::find($post_id);

        if ($post) {
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
