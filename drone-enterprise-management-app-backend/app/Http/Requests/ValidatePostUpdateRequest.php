<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;


class ValidatePostUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => 'file|mimes:png,jpg,jpeg,mp4,mov|max:10000',
            'cover' => 'file|mimes:png,jpg,jpeg,mp4,mov|max:10000',
            'location' => ['required', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:500'],
            'visibility' => ['required', 'in:true,false']
        ];
    }
}
