<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use Exception;
use Illuminate\Session\TokenMismatchException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Validation\ValidationException;
use Throwable;

// use Illuminate\Contracts\Debug\ExceptionHandler;
// use DB;
// use \Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{

    // use HttpResponses;
    use HttpResponses, HasApiTokens;


    // public function login(LoginUserRequest $request)
    // {
    //     $request->validated($request->all());

    //     if (!Auth::attempt($request->only(['email', 'password']))) {
    //         return $this->error([
    //             'request' => [
    //                 'email' => $request->email,
    //                 'password' => $request->password
    //             ]
    //         ], 'CREDENTIALS_MISMATCH', 401);
    //     }

    //     $user = User::where('email', $request->email)->first();

    //     return $this->success([
    //         'user' => [
    //             'id' => $user->id,
    //             'email' => $user->email,
    //             'email_verified_at' => $user->email_verified_at,
    //         ],
    //     ]);

    // }

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

        try {
            $request->validated($request->all());

            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return $this->success([
                'user' => $user,
            ]);

        } catch (AuthorizationException $authorizationException) {
            return $this->error(
                [
                    'request' => [
                        'email' => $request->email,
                        'password' => $request->password
                    ]
                ],
                $authorizationException->getMessage(),
                401
            );
        } catch (TokenMismatchException $tokenMismatchException) {
            return $this->error(
                [
                    'request' => [
                        'email' => $request->email,
                        'password' => $request->password
                    ]
                ],
                'TOKEN_MISMATCH',
                401
            );
        }

    }

    public function logout(Request $request)
    {
        Auth::user()->currentAccessToken()->delete();

        return $this->success([
            'You have successufully been logged out and your session is no longer available'
        ]);
    }

}
