<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\SubserviceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BackgroundMusicController;
use App\Mail\NotificationEmail;

Route::get('/posts', [PostController::class, 'index']);

Route::post('/posts/create', [PostController::class, 'store']);

Route::delete('/posts/delete/{post_id}', [PostController::class, 'delete']);

Route::put('/posts/update/{post_id}', [PostController::class, 'update']);

Route::get('/services', [ServiceController::class, 'index']);

Route::get('/subservices', [SubserviceController::class, 'index']);

Route::get('/background-music', [BackgroundMusicController::class, 'index']);

Route::get('/states', [StateController::class, 'index']);

Route::get('/dates', [OrderController::class, 'indexOrderDates']);

Route::get('/orders', [OrderController::class, 'index']);

Route::get('/notify-email', function () {

    $title = "Zmiana statusu Twojego zlecenia";
    $content = "Aktualny status Twojego zlecenia:";
    $state = "W realizacji";
    $comment = 'Twoje zlecenie jest w trakcie realizacji';

    return new NotificationEmail($title, $content, $state, $comment);

});


















