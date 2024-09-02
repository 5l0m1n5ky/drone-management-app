<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    private $title;
    private $content;
    private $state;
    private $comment;

    /**
     * Create a new message instance.
     */
    public function __construct($title, $content, $state, $comment)
    {
        $this->title = $title;
        $this->content = $content;
        $this->state = $state;
        $this->comment = $comment;

    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Notification Email',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $title = $this->title;
        $content = $this->content;
        $state = $this->state;
        $comment = $this->comment;

        return new Content(
            markdown: 'mail.notificationEmail',
            with: [
                'title' => $title,
                'content' => $content,
                'state' => $state,
                'comment' => $comment
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
