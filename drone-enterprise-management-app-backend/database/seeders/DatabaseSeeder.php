<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\Post::create([
            'visibility' => false,
            'location' => 'Zalew Koronowski',
            'path' => env('APP_ADDRESS') . '/storage/posts/square.jpg',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex',
        ]);

        \App\Models\Post::create([
            'visibility' => false,
            'location' => 'Bydgoszcz',
            'path' => env('APP_ADDRESS') . '/storage/posts/vertical.jpg',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex',
        ]);

        \App\Models\Post::create([
            'visibility' => false,
            'location' => 'Mosty Kolejowe nad Brdą',
            'path' => env('APP_ADDRESS') . '/storage/posts/windmill.jpg',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        ]);

        \App\Models\User::create([
            'email' => 'slomin.sky.drone@gmail.com',
            'password' => Hash::make('P455w0rd!'),
            'role' => 'admin',
            'verification_token' => '311223',
        ]);


    }
}
