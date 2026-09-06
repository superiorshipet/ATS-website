<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'graduate_id',
        'title',
        'company',
        'duration',
        'description',
    ];
}
