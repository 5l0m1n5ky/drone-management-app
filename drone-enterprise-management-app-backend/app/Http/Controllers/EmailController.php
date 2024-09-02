<?php

namespace App\Http\Controllers;

use App\Mail\AccountVeryficationEmail;
use App\Mail\NotificationEmail;
use App\Mail\TestMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;
use Illuminate\Support\Str;


class EmailController extends Controller
{
    public function sendMail()
    {
        try {

            $user = User::find(1);

            $response = Mail::to($user->email)
                // $response = Mail::to('slomin.sky.drone@gmail.com')
                ->send(new AccountVeryficationEmail());

            $verificationToken = Str::random(128);

            $user->update(['verification_token' => $verificationToken]);

            return response()->json([
                'status' => 'EMAIL_SENT',
                'message_id' => $response->getMessageId(),
                'verification_token' => $user->verification_token
            ]);


        } catch (Throwable $exception) {

            return response()->json([
                'status' => 'EMAIL_ERROR',
            ]);

        }

    }

    public function sendNotificationEmail($email, $title, $content, $state = null, $comment)
    {
        $response = Mail::to($email)->send(new NotificationEmail($title, $content, $state, $comment));

    }
}
