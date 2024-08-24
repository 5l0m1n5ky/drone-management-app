<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = DB::table('services')->orderBy('id')->get();

        return response()->json($services);
    }
}
