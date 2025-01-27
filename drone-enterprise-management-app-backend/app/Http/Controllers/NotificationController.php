<?php

namespace App\Http\Controllers;

use App\Models\State;
use App\Models\Notification;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EmailController;
use App\Http\Requests\NotificationSeenUpdateRequest;


class NotificationController extends Controller
{

    use HttpResponses;

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
                $notifications = Notification::orderBy('created_at')->get();

                foreach ($notifications as $notification) {

                    $state = State::where('id', $notification->state_id)->pluck('state_type')->first();

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
                $notifications = Notification::where('user_id', $user_id)->orderBy('created_at')->get();

                foreach ($notifications as $notification) {

                    $state = State::where('id', $notification->state_id)->pluck('state_type')->first();

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
                    'DENIED',
                    'Odrzucono żądanie',
                    500
                );
            }
        } catch (\ErrorException $errorException) {
            return $this->error(
                $errorException,
                'Błąd przetwarzania żądania',
                500
            );
        }
    }

    public function createNotification($userId, $email, $stateId = null, $comment = null, $title, $content)
    {

        Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'content' => $content,
            'comment' => $comment,
            'state_id' => $stateId,
            'seen' => false
        ]);

        $state = null;

        if ($stateId) {
            $state = State::find($stateId);
        }

        $this->emailController->sendNotificationEmail($email, $title, $content, $state->state_type, $comment);

    }

    public function update(NotificationSeenUpdateRequest $notificationSeenUpdateRequest)
    {

        try {
            $notificationSeenUpdateRequest->validated($notificationSeenUpdateRequest->all());

            $notification = Notification::find($notificationSeenUpdateRequest->notificationId);

            if (!$notification) {
                return $this->error(
                    'NOTIFICATION_UPDATE_ERROR',
                    'Bład aktualizacji powiadomienia',
                    500
                );
            }

            $result = $notification->update(['seen' => true]);

            if ($result) {
                return $this->success(
                    'NOTIFICATION_UPDATED',
                    'Zaktualizowano status powiadomienia',
                    200
                );
            } else {
                return $this->error(
                    'NOTIFICATION_UPDATE_ERROR',
                    'Bład aktualizacji powiadomienia',
                    500
                );
            }
        } catch (\ErrorException $errorException) {
            return $this->error(
                'REQUEST_ERROR',
                'Bład w przetwarzaniu żądania',
                500
            );
        }
    }
}
