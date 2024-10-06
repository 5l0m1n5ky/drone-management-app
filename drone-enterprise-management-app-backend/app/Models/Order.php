<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'street_name',
        'street_number',
        'apartment_number',
        'zip',
        'city',
        'email',
        'tel',
        'order_alias',
        'customer_comment'
    ];

    public function subject(){
        return $this->belongsToMany(Checklist::class, 'order_checklist');
    }
}
