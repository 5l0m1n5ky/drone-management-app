<?php

use App\Http\Controllers\InspectionReportController;
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
    return env("APP_ENV") === "local"
        ? view('welcome')
        : redirect(env("FRONTEND_URL"));
});

// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/register', [AuthController::class, 'register']);

// Route::group(['middleware' => 'auth:sanctum'], function () {
//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::get('/user/check', [AuthController::class, 'check']);
//     Route::post('/posts', [PostController::class, 'store'])->middleware('restrictRole:admin');
//     //POST method works with usage of Angular FormData body unlike to PUT or PATCH
//     Route::post('/posts/update/{post_id}', [PostController::class, 'update'])->middleware('restrictRole:admin');
//     Route::delete('/posts/{post_id}', [PostController::class, 'delete'])->middleware('restrictRole:admin');
//     Route::post('/orders', [OrderController::class, 'store']);
//     Route::put('/orders', [StateController::class, 'update'])->middleware('restrictRole:admin');
//     Route::get('/notifications', [NotificationController::class, 'index']);
//     Route::put('/notifications', [NotificationController::class, 'update']);
//     Route::get('orders/checklist/{orderId}', action: [ChecklistController::class, 'index'])->middleware('restrictRole:admin');
//     Route::put('orders/checklist/{orderId}', action: [ChecklistController::class, 'update'])->middleware('restrictRole:admin');
//     Route::post('orders/inspection-file', action: [InspectionReportController::class, 'store'])->middleware('restrictRole:admin');
//     Route::get('orders/inspection-file/{orderId}', action: [InspectionReportController::class, 'download']);
// });

// Route::post('/verify-account', [AuthController::class, 'verifyAccount']);
// Route::post('/regenerate-token', [AuthController::class, 'regenerateToken']);
// Route::post('/contact', [ContactControler::class, 'store']);
// Route::get('/posts', [PostController::class, 'index']);
// Route::get('/services', [ServiceController::class, 'index']);
// Route::get('/subservices', [SubserviceController::class, 'index']);
// Route::get('/background-music', [BackgroundMusicController::class, 'index']);
// Route::get('/states', [StateController::class, 'index']);
// Route::get('/dates', [OrderController::class, 'indexOrderDates']);
// Route::get('/orders', [OrderController::class, 'index']);







