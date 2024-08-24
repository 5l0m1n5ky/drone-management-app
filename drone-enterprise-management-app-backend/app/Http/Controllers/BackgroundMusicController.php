<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class BackgroundMusicController extends Controller
{
    public function index()
    {
        $services = DB::table('background_music')->orderBy('id')->get();

        return response()->json($services);
    }
}
