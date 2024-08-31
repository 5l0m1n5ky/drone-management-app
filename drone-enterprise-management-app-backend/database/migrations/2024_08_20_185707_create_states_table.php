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
        Schema::create('states', function (Blueprint $table) {
            $table->id();
            $table->enum('state_type', ['Przyjęte', 'W realizacji', 'Zrealizowane', 'Do modyfikacji', 'Odrzucone']);
            $table->enum('color', ['state-confirmed', 'state-in-progress', 'state-complete', 'state-to-modify', 'state-cancelled']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('states');
    }
};
