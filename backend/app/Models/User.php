<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'password_hash',
        'phone',
        'user_type',
        'avatar_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function graduate(): HasOne
    {
        return $this->hasOne(Graduate::class);
    }

    public function employer(): HasOne
    {
        return $this->hasOne(Employer::class);
    }
}
