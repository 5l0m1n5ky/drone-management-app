<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use Exception;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Validation\ValidationException;

// use Illuminate\Contracts\Debug\ExceptionHandler;
// use DB;
// use \Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{

    use HttpResponses;
    // use HttpResponses, HasApiTokens;


    public function login(LoginUserRequest $request)
    {
        // $request->validated($request->all());

        // if (!Auth::attempt($request->only(['email', 'password']))) {
        //     return $this->error([
        //         'request' => [
        //             'email' => $request->email,
        //             'password' => $request->password
        //         ]
        //     ], 'CREDENTIALS_MISMATCH', 401);
        // }

        // $user = User::where('email', $request->email)->first();
        // // $token = $user->createToken('API TOKEN', ['*'], now()->addHour())->plainTextToken;
        // // $token_expiration = DB::table('personal_access_tokens')->where('id', auth::user()->tokens->first()->id)->first()->expires_at;

        // return $this->success([
        //     'user' => [
        //         'id' => $user->id,
        //         'email' => $user->email,
        //         'email_verified_at' => $user->email_verified_at,

        //     ],
        //     // 'token' => $token,
        //     // 'token_expiration' => $token_expiration,
        // ]);

        try {

            $request->validated($request->all());

            $AuthAttempt = Auth::attempt($request->only(['email', 'password']));

            if ($AuthAttempt) {
                $user = User::where('email', $request->email)->first();

                return $this->success([
                    'user' => [
                        'id' => $user->id,
                        'email' => $user->email,
                        'email_verified_at' => $user->email_verified_at,

                    ],
                ]);
            }

        } catch (HttpException $httpException) {

            return $this->error(
                [
                    'request' => [
                        'email' => $request->email,
                        'password' => $request->password
                    ]
                ],
                $httpException->getMessage(),
                401
            );

        }
        // } catch (ValidationException $e) {
        //     return response()->json([
        //         'message' => 'Validation failed',
        //         'errors' => $e->errors()
        //     ], 422);
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'An error occurred',
        //         'error' => $e->getMessage()
        //     ], 500);
        // }
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
            // 'token' => $user->createToken('API TOKEN')->plainTextToken,
            // 'token_expiration' => $user->,
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
