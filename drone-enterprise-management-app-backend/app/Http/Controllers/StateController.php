<?php

namespace App\Http\Controllers;
use App\Http\Requests\StateRequest;
use App\Models\Order;
use App\Models\State;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class StateController extends Controller
{

    use HttpResponses;

    protected $notificationController;

    public function __construct(NotificationController $notificationController)
    {
        $this->notificationController = $notificationController;
    }
    public function index()
    {
        $services = State::orderBy('id')->get();

        return response()->json($services);
    }

    public function update(StateRequest $stateRequest)
    {
        try {
            $stateRequest->validated($stateRequest->all());

            $order_id = $stateRequest->orderId;
            $state_id = $stateRequest->stateId;
            $comment = $stateRequest->comment;

            $result = Order::where('id', $order_id)->update(['state_id' => $state_id]);
            $userId = Order::where('id', $order_id)->pluck('user_id')->first();
            $user = User::where('id', $userId)->first();
            $email = $user->email;

            $title = "Zmiana statusu Twojego zlecenia";
            $content = "Aktualny status Twojego zlecenia:";

            $this->notificationController->createNotification($userId, $email, $state_id, $comment, $title, $content);

            if ($result) {
                return $this->success(
                    'STATE_UPDATED',
                    'Zaktualizowano status zlecenia',
                    200
                );
            } else {
                return $this->error(
                    'STATE_UPDATE_ERROR',
                    'Bład aktualizacji zlecenia',
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
