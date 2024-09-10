<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $sender_email;
    public $messsage_subject;
    public $content;

    public function __construct($sender_email, $subject, $content)
    {
        $this->sender_email = $sender_email;
        $this->messsage_subject = $subject;
        $this->content = $content;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ktoś poprosił o kontakt',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {

        $sender_email = $this->sender_email;
        $messsage_subject = $this->messsage_subject;
        $content = $this->content;

        return new Content(
            markdown: 'mail.contactMessageEmail',
            with: [
                'sedner_email' => $sender_email,
                'subject' => $messsage_subject,
                'content' => $content,
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
