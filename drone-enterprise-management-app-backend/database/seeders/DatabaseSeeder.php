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
        \App\Models\Post::create([
            'visibility' => true,
            'location' => 'Ostromecko',
            'path' => env('APP_ADDRESS') . '/storage/posts/Ostromecko_18IX.png',
            'cover' => null,
            'description' => 'Ostromecko na jesiennym progu',
        ]);

        \App\Models\Post::create([
            'visibility' => true,
            'location' => 'Bydgoszcz - Plac Teatralny',
            'path' => env('APP_ADDRESS') . '/storage/posts/wheel.png',
            'cover' => null,
            'description' => 'Takie widoki tylko na Bydgoskim Jarmarku Bożonarodzeniowym',
        ]);

        \App\Models\Post::create([
            'visibility' => false,
            'location' => 'Maksymilianowo',
            'path' => env('APP_ADDRESS') . '/storage/posts/DJI_0033_retouch.jpg',
            'cover' => null,
            'description' => 'Nightrain',
        ]);

        \App\Models\Post::create([
            'visibility' => true,
            'location' => 'Chojnice',
            'path' => env('APP_ADDRESS') . '/storage/posts/chojnice lipiec 2024.mp4',
            'cover' => env('APP_ADDRESS') . '/storage/posts/covers/chojnice-cover.png',
            'description' => 'Tymczasem na rynku w Chojnicach...',
        ]);

        // User

        \App\Models\User::create([
            'email' => 'slomin.sky.drone@gmail.com',
            'password' => Hash::make('P455w0rd!'),
            'role' => 'admin',
            'newsletter' => false,
            'email_verified_at' => Carbon::now('Europe/Warsaw')
        ]);

        // Service

        \App\Models\Service::create([
            'service_type' => 'foto/video',
        ]);

        \App\Models\Service::create([
            'service_type' => 'inspekcja PV',
        ]);

        \App\Models\Service::create([
            'service_type' => 'fotogrametria',
        ]);

        \App\Models\Service::create([
            'service_type' => 'inspekcja energetyczna',
        ]);

        \App\Models\Service::create([
            'service_type' => 'inspekcja turbin',
        ]);

        // Subservice

        \App\Models\Subservice::create([
            'service_id' => 1, //foto/video
            'subservice' => 'spot reklamowy',
            'unit_amount_min' => 1,
            'unit_amount_max' => 15,
            'unit_price' => 150
        ]);

        \App\Models\Subservice::create([
            'service_id' => 1, //foto/video
            'subservice' => 'relacja z wydarzenia',
            'unit_amount_min' => 1,
            'unit_amount_max' => 30,
            'unit_price' => 125
        ]);

        \App\Models\Subservice::create([
            'service_id' => 1, //foto/video
            'subservice' => 'fotografia',
            'unit_amount_min' => 1,
            'unit_amount_max' => 50,
            'unit_price' => 30
        ]);

        \App\Models\Subservice::create([
            'service_id' => 2, //pv
            'subservice' => 'inspekcja RGB',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 150
        ]);

        \App\Models\Subservice::create([
            'service_id' => 2, //pv
            'subservice' => 'inspekcja IR',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 250
        ]);

        \App\Models\Subservice::create([
            'service_id' => 2, //pv
            'subservice' => 'inspekcja RGB + IR',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 350
        ]);

        \App\Models\Subservice::create([
            'service_id' => 3, //fotogramteria
            'subservice' => 'ortofotomapa',
            'unit_amount_min' => 1,
            'unit_amount_max' => 100,
            'unit_price' => 50
        ]);

        \App\Models\Subservice::create([
            'service_id' => 3, //fotogramteria
            'subservice' => 'ortomozaika',
            'unit_amount_min' => 1,
            'unit_amount_max' => 100,
            'unit_price' => 75
        ]);

        \App\Models\Subservice::create([
            'service_id' => 3, //fotogramteria
            'subservice' => 'model 3D',
            'unit_amount_min' => 1,
            'unit_amount_max' => 500,
            'unit_price' => 10
        ]);

        \App\Models\Subservice::create([
            'service_id' => 4, //eneregtyka
            'subservice' => 'inspekcja RGB',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 250
        ]);

        \App\Models\Subservice::create([
            'service_id' => 4, //eneregtyka
            'subservice' => 'inspekcja IR',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 300
        ]);

        \App\Models\Subservice::create([
            'service_id' => 4, //eneregtyka
            'subservice' => 'inspekcja RGB + IR',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 400
        ]);

        \App\Models\Subservice::create([
            'service_id' => 5, //turbiny
            'subservice' => 'inspekcja RGB',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 300
        ]);

        \App\Models\Subservice::create([
            'service_id' => 5, //turbiny
            'subservice' => 'inspekcja IR',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 350
        ]);

        \App\Models\Subservice::create([
            'service_id' => 5, //turbiny
            'subservice' => 'inspekcja RGB + IR',
            'unit_amount_min' => 1,
            'unit_amount_max' => 10,
            'unit_price' => 550
        ]);

        // Background Music

        \App\Models\BackgroundMusic::create([
            'type' => 'ambient'
        ]);

        \App\Models\BackgroundMusic::create([
            'type' => 'rock/metal'
        ]);

        \App\Models\BackgroundMusic::create([
            'type' => 'jazz'
        ]);

        \App\Models\BackgroundMusic::create([
            'type' => 'klasyczna'
        ]);

        \App\Models\BackgroundMusic::create([
            'type' => 'elektroniczna'
        ]);

        \App\Models\BackgroundMusic::create([
            'type' => 'dowolny'
        ]);

        \App\Models\BackgroundMusic::create([
            'type' => 'brak'
        ]);

        // State

        \App\Models\State::create([
            'state_type' => 'Przyjęte',
            'color' => 'state-confirmed'
        ]);

        \App\Models\State::create([
            'state_type' => 'W realizacji',
            'color' => 'state-in-progress'
        ]);

        \App\Models\State::create([
            'state_type' => 'Zrealizowane',
            'color' => 'state-complete'
        ]);

        \App\Models\State::create([
            'state_type' => 'Do modyfikacji',
            'color' => 'state-to-modify'
        ]);

        \App\Models\State::create([
            'state_type' => 'Odrzucone',
            'color' => 'state-cancelled'
        ]);

        // Checlist

        \App\Models\Checklist::create([
            'type' => 'Zezwolenie na lot'
        ]);
        \App\Models\Checklist::create([
            'type' => 'Korzystne warunki atmosferyczne'
        ]);
        \App\Models\Checklist::create([
            'type' => 'Akceptowalny stan techniczny SBSP'
        ]);
        \App\Models\Checklist::create([
            'type' => 'Naładowanie akumulatorów'
        ]);
        \App\Models\Checklist::create([
            'type' => 'Odpowidnia ilość miejsca na nośniku pamięci'
        ]);
        \App\Models\Checklist::create([
            'type' => 'Przeszkolenie pilota SBSP'
        ]);
        \App\Models\Checklist::create([
            'type' => 'Opracowanie planu realizacji zlecenia'
        ]);
    }
}
