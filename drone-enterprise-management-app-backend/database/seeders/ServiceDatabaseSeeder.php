<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        \App\Models\Service::create([
            'service_type' => 'foto/video',
        ]);

        \App\Models\Service::create([
            'service_type' => 'inspekcja_pv',
        ]);

        \App\Models\Service::create([
            'service_type' => 'fotogrametria',
        ]);

        \App\Models\Service::create([
            'service_type' => 'inspekcja_energetyczna',
        ]);

        \App\Models\Service::create([
            'service_type' => 'inspekcja_turbin',
        ]);
    }
}
