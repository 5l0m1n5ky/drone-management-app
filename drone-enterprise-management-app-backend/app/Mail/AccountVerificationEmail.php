<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountVerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $emailSubject = 'Weryfikacja konta w systemie SlominSky';

    /**
     * Create a new message instance.
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Account Verification Email',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {

        $token = $this->user->verification_token;
        // $user_id = $this->user->id;
        // $url = 'localhost:4200/verifyToken?user_id=' . $user_id . '&token=' . $token;

        return new Content(
            markdown: 'mail.accountVerificationEmail',
            with: [
                'token' => $token
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
