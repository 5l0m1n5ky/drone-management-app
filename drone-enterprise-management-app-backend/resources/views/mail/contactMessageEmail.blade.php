@component('mail::message')
<h1>Masz nową wiadomość</h1><br>
<h2>
E-mail nadawcy:
</h2>
<p>
{{ $sender_email }}
</p>
<h2>
Temat wiadomości:
</h2>
<p>
{{ $subject }}
</p>
<h2>
Treść wiadomości:
</h2>
<p>
{{ $content }}
</p>
@endcomponent
