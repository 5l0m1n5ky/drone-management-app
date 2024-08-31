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
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subservice_id')->references('id')->on('subservices');
            $table->string('amount');
            $table->foreignId('background_music_id')->nullable()->references('id')->on('background_music');
            $table->enum('format', ['4:3', '3:4', '16:9', '9:16', '21:9', '1:1'])->nullable();
            $table->boolean('report')->nullable();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
