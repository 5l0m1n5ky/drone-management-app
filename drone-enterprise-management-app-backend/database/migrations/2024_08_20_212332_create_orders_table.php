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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->references('id')->on('services');
            $table->foreignId('user_id')->references('id')->on('users');
            $table->foreignId('state_id')->references('id')->on('states');
            $table->foreignId('order_details_id')->references('id')->on('order_details')->onDelete('cascade');
            $table->float('price_brutto');
            $table->date('date');
            $table->float('order_latitude');
            $table->float('order_longitude');
            $table->string('customer_name');
            $table->string('customer_surname')->nullable();
            $table->string('nip')->nullable();
            $table->string('street_name');
            $table->string('street_number');
            $table->string('apartment_number')->nullable();
            $table->string('zip');
            $table->string('city');
            $table->longText('customer_comment')->nullable();
            $table->string('email');
            $table->string('tel');
            $table->string('order_alias');
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
