@component('mail::message')
<h1>{{ $title }}</h1>
<p>{{ $content }}</p>
<h2 id="state-highlight">{{ $state }}</h2>
@if ($comment)
<p>Komentarz do zmiany statusu:</p>
<h4>{{ $comment }}</h4>
@endif
@endcomponent
