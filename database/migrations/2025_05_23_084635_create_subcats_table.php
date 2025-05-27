<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subcats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('catid')->index();
            $table->foreign('catid')->references('id')->on('cats')->onDelete('cascade');
            $table->string('name')->index();
            $table->timestamps();
            $table->unique('name','catid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subcats');
    }
};
