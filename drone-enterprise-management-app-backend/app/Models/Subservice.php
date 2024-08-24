<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subservice extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'subservice',
        'unit_amount_min',
        'unit_amount_max',
        'unit_price'
    ];
}
