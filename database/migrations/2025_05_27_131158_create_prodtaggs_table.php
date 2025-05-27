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
       Schema::create('prodtaggs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prodid')
                ->constrained('prods')
                ->onDelete('cascade');
            $table->foreignId('taggid')
                ->constrained('taggs')
                ->onDelete('cascade');
            $table->timestamps();
            $table->unique(['prodid', 'taggid'], 'prodtaggs_unique'); // Ensure unique combination of prodid and taggid
        });
      
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prodtaggs');
    }
};
