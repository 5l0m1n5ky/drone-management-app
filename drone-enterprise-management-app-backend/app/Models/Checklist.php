<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Checklist extends Model
{
    use HasFactory;

    protected $table = 'checklist';

    protected $fillable = [
        'type'
    ];

    public $timestamps = false;

    public function subject()
    {
        return $this->belongsToMany(Order::class, 'order_checklist');
    }
}
