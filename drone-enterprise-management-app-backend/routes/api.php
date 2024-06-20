<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;


use App\Mail\InvoicePaid;
use App\Models\Invoice;



use App\Models\User;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Public Routes

// Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

Route::post('/verifyAccount', [AuthController::class, 'verifyAccount']);

Route::post('/regenerateToken/{user_id}', [AuthController::class, 'regenerateToken']);

// Protected Routes

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Route::post('/logout', [AuthController::class, 'logout']);

// Route::get('/email', [EmailController::class, 'sendMail']);

Route::get('/email', [
    function () {
        $user = User::find(8);
        return new \App\Mail\AccountVerificationEmail($user);
    }
]);





