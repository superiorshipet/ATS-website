<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    const UPDATED_AT = 'updated_at';
    const CREATED_AT = null;

    protected $fillable = [
        'job_id',
        'graduate_id',
        'cover_letter',
        'status',
        'score',
        'applied_at',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function graduate(): BelongsTo
    {
        return $this->belongsTo(Graduate::class, 'graduate_id', 'user_id');
    }
}
