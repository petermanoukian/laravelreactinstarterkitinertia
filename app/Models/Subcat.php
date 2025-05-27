<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Cat;
use App\Models\Prod;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subcat extends Model
{
    protected $fillable = [
        'name','catid'
    ];

    public function cat(): BelongsTo
    {
        return $this->belongsTo(Cat::class, 'catid', 'id');
    }
	public function subprods(): HasMany
    {
        return $this->hasMany(Prod::class, 'subid', 'id');
    }
}
