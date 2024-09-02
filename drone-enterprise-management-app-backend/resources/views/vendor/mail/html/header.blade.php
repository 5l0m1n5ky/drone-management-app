@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="{{ asset(env('APP_ADDRESS') . '/storage/logo_white.png') }}" class="logo"
alt="SlominSky Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
