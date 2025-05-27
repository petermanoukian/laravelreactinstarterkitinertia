<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Subcat;
use App\Models\Prod;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cat extends Model
{
    use HasFactory;
    protected $table = 'cats';
    protected $fillable = [
        'name',
    ];

    public function subcats(): HasMany
    {
        return $this->hasMany(Subcat::class, 'catid', 'id');
    }
    public function catprods(): HasMany
    {
        return $this->hasMany(Prod::class, 'catid', 'id');
    }
    
    public function allSubProds()
	{
		return $this->hasManyThrough(
			\App\Models\Prod::class,  // Final model
			\App\Models\Subcat::class, // Intermediate model
			'catid',    // Foreign key on Subcat (intermediate) table
			'subid',    // Foreign key on Prod (final) table
			'id',       // Local key on Cat
			'id'        // Local key on Subcat
		);
	}

}
