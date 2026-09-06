<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('about', function () {
    $this->comment('ATS Laravel backend');
})->purpose('Display ATS backend information');
