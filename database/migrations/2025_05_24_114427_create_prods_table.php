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
        Schema::create('prods', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('catid')->index();
            $table->foreign('catid')->references('id')->on('cats')->onDelete('cascade');
            $table->unsignedBigInteger('subid')->index();
             $table->foreign('subid')->references('id')->on('subcats')->onDelete('cascade');
            $table->string('name')->index();
            $table->string('coder')->unique();
            $table->integer('ordd')->default(0)->nullabe();
            $table->string('img')->nullable();
            $table->string('img2')->nullable();
            $table->string('filer')->nullable();
            $table->text('des')->nullable();
            $table->longText('dess')->nullable();
            $table->decimal('prix', 10, 2)->default(0.00);
            $table->integer('quan')->default(0);
            $table->boolean('vis')->default(true);
            $table->timestamps();
            $table->unique(['name','catid','subid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prods');
    }
};
