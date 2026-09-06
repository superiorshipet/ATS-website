<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    protected $fillable = [
        'employer_id',
        'title',
        'department',
        'location',
        'job_type',
        'salary_range',
        'description',
        'requirements',
        'skills',
        'status',
    ];

    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class, 'employer_id', 'user_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
