<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index()
    {
        $services = DB::table('states')->orderBy('id')->get();

        return response()->json($services);
    }
}
