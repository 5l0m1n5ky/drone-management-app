<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Requests\StoreMessageRequest;
use App\Models\User;
use Psy\Exception\ErrorException;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;

class ContactControler extends Controller
{

    use HttpResponses;

    protected $emailController;

    public function __construct(EmailController $emailController)
    {
        $this->emailController = $emailController;
    }

    public function store(StoreMessageRequest $storeMessageRequest)
    {
        $storeMessageRequest->validated($storeMessageRequest->all());

        try {
            $admin_email = User::where('role', 'admin')->pluck('email')->first();

            $message = Message::create([
                'email' => $storeMessageRequest->email,
                'subject' => $storeMessageRequest->subject,
                'content' => $storeMessageRequest->content
            ]);

            if ($message) {

                $this->emailController->forwardMessageMail($admin_email, $storeMessageRequest->email, $storeMessageRequest->subject, $storeMessageRequest->content);

                return $this->success(
                    'Wiadomość wysłana pomyślnie',
                    'MESSAGE_SENT',
                    200
                );
            } else {
                return $this->error(
                    'Bład wysyłania wiadomości',
                    'MESSAGE_ERROR',
                    500
                );
            }

        } catch (\ErrorException $errorException) {
            return $this->error(
                'Bład wysyłania wiadomości',
                'MESSAGE_ERROR',
                500
            );
        }
    }
}
