<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
use App\Models\Cat;
use App\Models\Subcat;
use App\Models\Tagg;
use App\Models\Prodtagg;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Prod extends Model
{
    use HasFactory;
    use HasRelationships;
    protected $table = 'prods';

    protected $fillable = [ 
        'catid','subid','name','coder','ordd','img','img2','filer','des','dess','prix','quan','vis',
    ];

    public function cat(): BelongsTo
    {
        return $this->belongsTo(Cat::class, 'catid', 'id');
    }
	
	public function sub(): BelongsTo
    {
        return $this->belongsTo(Subcat::class, 'subid', 'id');
    }
	
	
	public function catThroughSubcat()
    {
        return $this->belongsToThrough(
            \App\Models\Cat::class,
            \App\Models\Subcat::class,
            null,
            '',
            [\App\Models\Subcat::class => 'subid']
        );
    }



    public function taggs(): BelongsToMany
    {
        return $this->belongsToMany(Tagg::class, 'prodtaggs', 'prodid', 'taggid')->withTimestamps();
    }


}
