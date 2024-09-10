<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\SubserviceController;
use App\Mail\ContactMessageEmail;
use App\Mail\NotifyAdminNewOrderEmail;
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

Route::get('/contact-email', function () {

    $sender_email = "mail@mail.com";
    $subject = "Prośba o stworzenie nowej usługi";
    $content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    return new ContactMessageEmail($sender_email, $subject, $content);
});

Route::get('/notify-admin', function () {

    $link = '127.0.0.1:4200/user/panel/orders';

    return new NotifyAdminNewOrderEmail($link);
});


















