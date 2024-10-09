<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderChecklist extends Model
{
    use HasFactory;

    protected $table = 'order_checklist';

    protected $fillable = [
        'order_id',
        'checklist_id',
        'checked'
    ];

    public $timestamps = false;
}
