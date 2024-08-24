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
            $table->foreignId('order_details_id')->references('id')->on('order_details');
            $table->float('price_brutto');
            $table->dateTime('datetime');
            $table->float('order_latitude');
            $table->float('order_longtitude');
            $table->string('customer_name');
            $table->string('customer_surname');
            $table->string('nip');
            $table->string('customer_address');
            $table->string('order_alias');
            $table->longText('customer_comment');
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
