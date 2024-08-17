<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;


class ValidatePostRequest extends FormRequest
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
            // 'file' => [
            //     'required',
            //     File::types(['jpg', 'jpeg', 'png', 'mp4', 'mov'])
            //         ->max(10 * 1024),
            // ],
            'file' => 'file|required|mimes:png,jpg,jpeg,mp4,mov|max:51200',
            'cover' => 'file|mimes:png,jpg,jpeg,mp4,mov|max:5120',
            'location' => ['required', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:500'],
            'visibility' => ['required']
        ];
    }
}
