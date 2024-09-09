@props(['url'])
<tr>
<td class="header">
<a href="{{ env('APP_ADDRESS') . '/storage/logo_white.png' }}" style="display: inline-block;">
{{-- @if (trim($slot) === 'Laravel') --}}
<img src="http://127.0.0.1:8000/storage/logo_white.png" class="logo"
alt="SlominSky Logo">
{{-- @else --}}
{{ $slot }}
{{-- @endif --}}
</a>
</td>
</tr>
