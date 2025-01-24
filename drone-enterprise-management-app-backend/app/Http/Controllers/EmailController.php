<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageEmail;
use App\Mail\NotificationEmail;
use App\Mail\AccountVerificationEmail;
use App\Mail\NotifyAdminNewOrderEmail;
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

    public function forwardMessageMail($email, $sender_email, $subject, $content)
    {
        Mail::to($email)->send(new ContactMessageEmail($sender_email, $subject, $content));
    }

    public function notifyAdminNewOrder($email, $link)
    {
        Mail::to($email)->send(new NotifyAdminNewOrderEmail($link));
    }
}
