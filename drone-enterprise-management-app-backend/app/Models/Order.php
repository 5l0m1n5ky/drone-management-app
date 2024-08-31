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
        'order_details_id',
        'price_brutto',
        'date',
        'order_latitude',
        'order_longitude',
        'customer_name',
        'customer_surname',
        'nip',
        'streetName',
        'streetNumber',
        'apartmentNumber',
        'zip',
        'city',
        'email',
        'tel',
        'order_alias',
        'customer_comment'
    ];
}
