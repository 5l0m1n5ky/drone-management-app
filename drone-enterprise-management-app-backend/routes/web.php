<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\ContactControler;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SubserviceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\BackgroundMusicController;
use App\Http\Controllers\ChecklistController;


Route::get('/', function () {
    return view('welcome');
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user/check', [AuthController::class, 'check']);

    Route::post('/posts/create', [PostController::class, 'store'])->middleware('restrictRole:admin');
    //POST method works with usage of Angular FormData body unlike to PUT or PATCH
    Route::post('/posts/update/{post_id}', [PostController::class, 'update'])->middleware('restrictRole:admin');
    Route::delete('/posts/delete/{post_id}', [PostController::class, 'delete'])->middleware('restrictRole:admin');

    Route::post('/orders/create', [OrderController::class, 'store']);
    Route::post('/orders/state-update', [StateController::class, 'update'])->middleware('restrictRole:admin');

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/seen', [NotificationController::class, 'update']);

    Route::get('orders/checklist/{orderId}', action: [ChecklistController::class, 'index'])->middleware('restrictRole:admin');
    Route::put('orders/checklist/update/{orderId}', action: [ChecklistController::class, 'update'])->middleware('restrictRole:admin');
});

Route::post('/verify-account', [AuthController::class, 'verifyAccount']);
Route::post('/regenerate-token', [AuthController::class, 'regenerateToken']);
Route::post('/contact', [ContactControler::class, 'store']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/subservices', [SubserviceController::class, 'index']);
Route::get('/background-music', [BackgroundMusicController::class, 'index']);
Route::get('/states', [StateController::class, 'index']);
Route::get('/dates', [OrderController::class, 'indexOrderDates']);
Route::get('/orders', [OrderController::class, 'index']);







