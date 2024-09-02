<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\EmailController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class NotificationController extends Controller
{

    protected $emailController;

    public function __construct(EmailController $emailController)
    {
        $this->emailController = $emailController;
    }

    public function index()
    {

        $user = Auth::user();
        $user_id = $user->id;

        try {
            if ($user->role === 'admin') {

                $notificationsData = [];
                $notifications = DB::table('notifications')->orderBy('created_at')->get();

                foreach ($notifications as $notification) {

                    $state = DB::table('states')->where('id', $notification->state_id)->pluck('state_type')->first();

                    $notificationData = [
                        'id' => $notification->id,
                        'userId' => $notification->user_id,
                        'title' => $notification->title,
                        'content' => $notification->content,
                        'comment' => $notification->comment,
                        'state' => $state,
                        'seen' => $notification->seen,
                        'createdAt' => $notification->created_at
                    ];

                    $notificationsData[] = $notificationData;
                }

                return response()->json($notificationsData);

            } else if ($user->role === 'user') {

                $notificationsData = [];
                $notifications = DB::table('notifications')->where('id', $user_id)->orderBy('created_at')->get();

                foreach ($notifications as $notification) {

                    $state = DB::table('states')->where('state_id', $notification->state_id)->pluck('state_type')->first('state_type');

                    $notificationData = [
                        'id' => $notification->id,
                        'userId' => $notification->user_id,
                        'title' => $notification->title,
                        'content' => $notification->content,
                        'comment' => $notification->comment,
                        'state' => $state,
                        'seen' => $notification->seen,
                        'createdAt' => $notification->created_at
                    ];

                    $notificationsData[] = $notificationData;
                }

                return response()->json($notificationsData);

            } else {
                return $this->error(
                    'You do not have such as previleges to make that request',
                    'DENIED',
                    500
                );
            }
        } catch (\ErrorException $errorException) {
            return $this->error(
                $errorException,
                'DENIED',
                500
            );
        }
    }

    public function createNotification($userId, $email, $stateId = null, $comment = null, $title, $content)
    {

        $notification = Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'content' => $content,
            'comment' => $comment,
            'state_id' => $stateId,
            'seen' => false
        ]);

        // $this->emailController->sendNotificationEmail($email, $title, $content);


        if ($notification) {
            // return 'NOTIFICATION_CREATED';
            return true;
        } else {
            return false;
            // return 'NOTIFICATION_ERROR';
        }
    }
}
