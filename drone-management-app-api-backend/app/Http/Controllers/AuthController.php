<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use Exception;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Throwable;

class AuthController extends Controller
{

    use HttpResponses, HasApiTokens;


    public function login(LoginUserRequest $request)
    {
        $request->validated($request->all());

        if (!Auth::attempt($request->only(['email', 'password']))) {
            return $this->error('', 'Credentials does not match', 401);
        }

        $user = User::where('email', $request->email)->first();

        return $this->success([
            'user' => $user,
            'token' => $user->createToken('API TOKEN')->plainTextToken
        ]);
    }

    public function register(StoreUserRequest $request)
    {
        $request->validated($request->all());

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->success([
            'user' => $user,
            'token' => $user->createToken('API TOKEN')->plainTextToken,
        ]);

    }

    public function logout(Request $request)
    {
        Auth::user()->currentAccessToken()->delete();

        return $this->success([
            'You have successufully been logged out and your session is no longer available'
        ]);
    }

}
