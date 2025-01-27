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








