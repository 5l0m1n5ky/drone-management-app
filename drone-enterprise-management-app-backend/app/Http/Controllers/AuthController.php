<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\User;
use App\Models\Token;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use Throwable;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    protected $emailController;

    public function __construct(EmailController $emailController)
    {
        $this->emailController = $emailController;
    }

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

            $user = User::where('email', $request->email)->first();

            if (!$user) {

                $new_user = User::create([
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'newsletter' => $request->newsletter,
                ]);

                if (!$new_user->hasVerifiedEmail()) {
                    $token = Token::create([
                        'user_id' => $new_user->id,
                        'token_value' => random_int(100000, 999999),
                    ]);

                    $this->emailController->sendRegistrationEmail($new_user->email, $token->token_value);
                }

                return $this->success(
                    [
                        'user' => [
                            'id' => $new_user->id,
                            'email' => $new_user->email,
                            'role' => $new_user->role
                        ],
                    ],
                    'SIGNED_UP',
                    200

                );
            } else {
                return $this->error(
                    'Wystąpił błąd w rejestracji konta',
                    'REGISTER_ERROR',
                    401
                );
            }

        } catch (\ErrorException $errorException) {
            return $this->error(
                'Wystąpił błąd w rejestracji konta',
                'REGISTER_ERROR',
                500
            );
        }
    }

    public function verifyAccount(Request $request)
    {
        $tokenToVerify = $request->query('token');
        $user_id = $request->query('user_id');
        $user = User::find($user_id);
        $token = DB::table('tokens')->where('user_id', $user_id)->pluck('token_value')->first();

        if (!$user->hasVerifiedEmail()) {

            if ($tokenToVerify === $token) {

                $user->markEmailAsVerified();

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

    public function regenerateToken(Request $request)
    {
        $request = $request->validate(['user_id' => ['required', 'numeric']]);

        $user_id = $request['user_id'];

        try {
            $user = User::find($user_id);

            if (!$user->hasVerifiedEmail()) {

                $exisitng_token = DB::table('tokens')->where('user_id', $user_id)->first();

                if ($exisitng_token) {
                    Token::find($exisitng_token->id)->delete();
                }

                $token = Token::create([
                    'user_id' => $user->id,
                    'token_value' => random_int(100000, 999999),
                ]);

                $this->emailController->sendRegistrationEmail($user->email, $token->token_value);

                return $this->success(
                    'Wygenerowano nowy token',
                    'TOKEN_REGENERATED',
                    200
                );
            } else {
                return $this->error(
                    'Wygenerowanie nowego tokena nie jest dostępne',
                    'TOKEN_REGENERATION_ERROR',
                    401
                );
            }
        } catch (\ErrorException $errorException) {
            return $this->error(
                $errorException,
                'TOKEN_REGENERATION_ERROR',
                500
            );
        }

    }

    public function logout(Request $request)
    {
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
