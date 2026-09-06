<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'graduate_id',
        'degree',
        'institution',
        'year',
    ];
}
