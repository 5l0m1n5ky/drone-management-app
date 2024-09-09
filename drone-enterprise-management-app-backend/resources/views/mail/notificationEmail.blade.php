@component('mail::message')
<h1>{{ $title }}</h1>
<p>{{ $content }}</p>
<h2 id="highlight">{{ $state }}</h2>
@if ($comment !== null)
<p>Komentarz do zmiany statusu:</p>
<h4 id="highlight">{{ $comment }}</h4>
@endif
@endcomponent
