<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\ContactControler;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SubserviceController;
use App\Http\Controllers\BackgroundMusicController;


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
    // Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/state-update', [StateController::class, 'update'])->middleware('restrictRole:admin');

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/seen', [NotificationController::class, 'update']);
});

Route::post('/verify-account', [AuthController::class, 'verifyAccount']); //tested
Route::post('/regenerate-token', [AuthController::class, 'regenerateToken']); //tested
Route::post('/contact', [ContactControler::class, 'store']);
Route::get('/posts', [PostController::class, 'index']); //tested
Route::get('/services', [ServiceController::class, 'index']);  //tested
Route::get('/subservices', [SubserviceController::class, 'index']); //tested
Route::get('/background-music', [BackgroundMusicController::class, 'index']); //tested
Route::get('/states', [StateController::class, 'index']); //tested
Route::get('/dates', [OrderController::class, 'indexOrderDates']); //tested
Route::get('/orders', [OrderController::class, 'index']); //tested





