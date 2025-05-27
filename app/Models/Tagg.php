<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Prod;
use App\Models\Prodtagg;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tagg extends Model
{
    protected $table = 'taggs';

    protected $fillable = [
        'name',
    ];

    public function prods(): BelongsToMany
    {
        return $this->belongsToMany(Prod::class, 'prodtaggs', 'taggid', 'prodid')->withTimestamps();
    }
}
