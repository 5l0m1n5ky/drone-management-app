<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // return true;
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
            'service_id' => ['required', 'numeric'],
            'subservice_id' => ['required', 'numeric'],
            'amount' => ['required', 'numeric'],
            'bgMusicId' => ['nullable', 'numeric'],
            'format' => ['nullable', 'string'],
            'report' => ['nullable', 'boolean'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'date' => ['required', 'date', 'date_format:Y-m-d'],
            'name' => ['required', 'string', 'min:2', 'max:30'],
            'surname' => ['nullable', 'string', 'min:2', 'max:30'],
            'nip' => ['nullable', 'numeric', 'digits:10'],
            'streetName' => ['required', 'string'],
            'streetNumber' => ['required', 'numeric', 'digits_between:1,3'],
            'apartmentNumber' => ['nullable', 'numeric', 'digits_between:1,4'],
            'city' => ['required', 'string', 'max:30'],
            'zip' => ['required', 'numeric', 'digits:5'],
            'tel' => ['required', 'numeric', 'digits:9'],
            'email' => ['required', 'email'],
            'alias' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric'],
        ];
    }

}
