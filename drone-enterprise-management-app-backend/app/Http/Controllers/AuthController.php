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
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Mail;
use App\Mail\AccountVerificationEmail;
use Illuminate\Validation\ValidationException;
use Throwable;
use Illuminate\Support\Str;


// use Illuminate\Contracts\Debug\ExceptionHandler;
// use DB;
// use \Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{

    // use HttpResponses;
    use HttpResponses, HasApiTokens;

    public function login(LoginUserRequest $request)
    {

        try {
            $request->validated($request->all());


            if (!Auth::attempt($request->only(['email', 'password']))) {
                return $this->error(
                    [
                        'user' => [
                            'email' => $request->email,
                            'password' => $request->password
                        ]
                    ],
                    'CREDENTIALS_MISMATCH',
                    401
                );
            }

            $request->session()->regenerate();

            $user = User::where('email', $request->email)->first();

            return $this->success(
                [
                    'user' => [
                        'id' => $user->id,
                        'email' => $user->email,
                        'privileges' => $user->role
                    ],
                ],
                'LOGGED_IN',
                200
            );

        } catch (Throwable $loginException) {
            return $this->error(
                [
                    'user' => [
                        'email' => $request->email,
                        'password' => $request->password
                    ]
                ],
                $loginException,
                500
            );
        }

    }

    public function register(StoreUserRequest $request)
    {

        try {
            $request->validated($request->all());

            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'verification_token' => random_int(100000, 999999),
            ]);

            if (!$user->hasVerifiedEmail()) {
                Mail::to($user->email)
                    ->send(new AccountVerificationEmail($user));
            }

            return $this->success(
                [
                    'user' => [
                        'id' => $user->id,
                        'email' => $user->email,
                        'role' => $user->role
                    ],
                ],
                'SIGNED_UP',
                200
            );


        } catch (ValidationException $authorizationException) {
            return $this->error(
                [
                    'request' => [
                        'email' => $request->email,
                        'password' => $request->password
                    ],
                    $authorizationException->getMessage()
                ],
            );

        }
    }

    public function verifyAccount(Request $request)
    {
        $token = $request->query('token');
        $user_id = $request->query('user_id');

        $user = User::find($user_id);

        if (!$user->hasVerifiedEmail()) {

            if ($user->verification_token === $token) {

                $user->markEmailAsVerified();

                // TODO: create new table verify_tokens and execute remove record by user_id

                return $this->success(
                    [
                        'request' => [
                            'id' => $user_id,
                            'token' => $token
                        ],
                    ],
                    'ACCOUNT_VERIFIED'
                );

            } else {
                return $this->error(
                    [
                        'request' => [
                            'id' => $user_id,
                            'token' => $token
                        ]
                    ],
                    'VERIFICATION_TOKEN_MISMATCH',
                    401
                );
            }
        } else {
            return $this->error(
                [
                    'request' => [
                        'id' => $user_id,
                        'token' => $token
                    ]
                ],
                'VERIFICATION_ERROR',
                401
            );
        }
    }


    public function regenerateToken()
    {

    }

    public function logout(Request $request)
    {
        // Auth::user()->currentAccessToken()->delete();

        $request->session()->invalidate();

        return $this->success(
            'Wylogowano pomyślnie',
            'SUCCESSFUL_LOGOUT',
            200
        );
    }

    public function check(Request $request)
    {
        return $this->success(
            'Your session is active',
            'ACTIVE_SESSION',
            200
        );
    }
}
