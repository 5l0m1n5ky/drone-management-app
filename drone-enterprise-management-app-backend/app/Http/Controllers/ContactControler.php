<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Http\Requests\StoreMessageRequest;
use Psy\Exception\ErrorException;
use App\Traits\HttpResponses;

class ContactControler extends Controller
{

    use HttpResponses;

    public function store(StoreMessageRequest $storeMessageRequest)
    {
        $storeMessageRequest->validated($storeMessageRequest->all());

        try {

            $message = Message::create([
                'email' => $storeMessageRequest->email,
                'subject' => $storeMessageRequest->subject,
                'content' => $storeMessageRequest->content
            ]);

            if ($message) {
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
