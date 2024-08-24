<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subservices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->references('id')->on('services');
            $table->enum('subservice', ['spot reklamowy', 'relacja z wydarzenia', 'fotografia', 'ortofotomapa', 'ortomozaika', 'model 3D', 'inspekcja RGB', 'inspekcja IR', 'inspekcja RGB + IR']);
            $table->integer('unit_amount_min');
            $table->integer('unit_amount_max');
            $table->integer('unit_price');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subservices');
    }
};
