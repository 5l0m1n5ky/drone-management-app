<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class SubserviceController extends Controller
{
    public function index()
    {
        $services = DB::table('subservices')->orderBy('id')->get();

        return response()->json($services);
    }
}
