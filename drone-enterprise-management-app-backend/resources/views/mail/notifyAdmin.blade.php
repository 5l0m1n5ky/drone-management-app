@component('mail::message')
<h1>Złożono zamówienie na zlecenie</h1>
<h3>Przejdź do szczegółow zlecenia:</h3>

@component('mail::button', ['url' => $link])
SZCZEGÓŁY ZLECENIA
@endcomponent

@endcomponent
