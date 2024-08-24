<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'user_id',
        'state_id',
        'price_brutto',
        'datetime',
        'order_latitude',
        'order_longtitude',
        'customer_name',
        'customer_surname',
        'nip',
        'customer_address',
        'order_alias',
        'customer_comment'
    ];
}
