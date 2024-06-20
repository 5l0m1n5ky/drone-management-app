<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        \App\Models\User::create([
            // 'name' => 'Test User',
            'email' => 'slomin.sky.drone@gmail.com',
            'password' => Hash::make('P455w0rd!'),
            'verification_token' => '311223'
        ]);
    }
}
