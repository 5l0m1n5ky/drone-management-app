<?php

namespace App\Http\Controllers;

use App\Mail\NotificationEmail;
use App\Mail\AccountVerificationEmail;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function sendNotificationEmail($email, $title, $content, $state = null, $comment)
    {
        Mail::to($email)->send(new NotificationEmail($title, $content, $state, $comment));

    }

    public function sendRegistrationEmail($email, $token)
    {
        Mail::to($email)->send(new AccountVerificationEmail($token));
    }
}
