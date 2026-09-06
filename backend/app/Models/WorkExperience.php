<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'graduate_id',
        'title',
        'company',
        'duration',
        'description',
    ];
}
