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
        Schema::create('background_music', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['ambient', 'rock/metal', 'jazz', 'klasyczna', 'elektroniczna', 'dowolna', 'brak']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('background_music');
    }
};
