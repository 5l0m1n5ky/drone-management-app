<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Request;
use App\Traits\HttpResponses;

class UserController extends Controller
{

    use HttpResponses;

    public function index()
    {

        $usersData = [];

        $users = User::where('role', 'user')->orderBy('id')->get(
            [
                'id',
                'email',
                'email_verified_at',
                'suspended',
                'created_at'
            ]
        );

        foreach ($users as $user) {
            $usersData[] = $user;
        }

        return response()->json($usersData);
    }

    public function update(UserRequest $request)
    {
        $request->validated($request->all());

        $userId = $request->id;

        try {
            $user = User::find($userId);

            $usersuspension = $user->suspended;

            $user->suspended = $usersuspension ? false : true;

            if ($user->save()) {
                return $this->success(
                    "USER_SUSPENSION_UPDATED",
                    'Zaktualizowano dane użytkownika',
                    200
                );
            } else {
                return $this->error(
                    'USER_SUSPENSION_UPDATE_ERROR',
                    'Błąd w przetwarzaniu żądania',
                    500
                );
            }
        } catch (\Exception $exception) {
            return $this->error(
                'USER_SUSPENSION_UPDATE_ERROR',
                'Błąd w przetwarzaniu żądania',
                500
            );
        }
    }
}
