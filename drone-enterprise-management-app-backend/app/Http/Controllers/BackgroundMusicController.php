<?php

namespace App\Http\Controllers;
use App\Models\BackgroundMusic;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class BackgroundMusicController extends Controller
{
    public function index()
    {
        $services = BackgroundMusic::orderBy('id')->get();

        return response()->json($services);
    }
}
