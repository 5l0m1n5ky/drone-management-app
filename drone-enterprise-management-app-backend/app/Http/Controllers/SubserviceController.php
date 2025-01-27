<?php

namespace App\Http\Controllers;
use App\Models\Subservice;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SubserviceController extends Controller
{
    public function index()
    {
        $services = Subservice::orderBy('id')->get();

        return response()->json($services);
    }
}
