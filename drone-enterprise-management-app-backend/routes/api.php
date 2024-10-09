<?php

use App\Http\Controllers\ChecklistController;

Route::get('orders/checklist/{orderId}', action: [ChecklistController::class, 'index']);

Route::put('orders/checklist/update/{orderId}', action: [ChecklistController::class, 'update']);




















