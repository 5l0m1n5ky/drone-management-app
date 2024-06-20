<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', 'min:6']
        ];
    }

    public function messages(): array
    {
        return [
            'password.min' => 'VALIDATION_ERROR',
            'required' => 'VALIDATION_ERROR',
            'email.string' => 'VALIDATION_ERROR',
            'email.email' => 'VALIDATION_ERROR',
            'password.string' => 'VALIDATION_ERROR',
        ];
    }

}
