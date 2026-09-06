<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'graduate_id',
        'degree',
        'institution',
        'year',
    ];
}
