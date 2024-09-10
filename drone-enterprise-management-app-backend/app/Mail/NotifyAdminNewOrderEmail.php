<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotifyAdminNewOrderEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $link;

    public function __construct($link)
    {
        $this->link = $link;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nowe zlecenie w systemie SlominSky',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $link = $this->link;

        return new Content(
            markdown: 'mail.notifyAdmin',
            with: [
                'sender_email' => 'sender_email',
                'subject' => '$messsage_subject',
                'content' => '$content',
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
