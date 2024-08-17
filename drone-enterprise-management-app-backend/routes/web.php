<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\PostController;



use App\Mail\InvoicePaid;
use App\Models\Invoice;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user/check', [AuthController::class, 'check']);
});

// Route::post('/posts/create', [PostController::class, 'store']);

Route::post('/register', [AuthController::class, 'register']);

Route::post('/posts/create', [PostController::class, 'store'])->middleware('restrictRole:admin');

//POST method works with usage of Angular FormData body unlike to PUT or PATCH
Route::post('/posts/update/{post_id}', [PostController::class, 'update'])->middleware('restrictRole:admin');

Route::delete('/posts/delete/{post_id}', [PostController::class, 'delete'])->middleware('restrictRole:admin');

