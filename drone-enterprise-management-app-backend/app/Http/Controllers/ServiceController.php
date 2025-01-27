<?php

namespace App\Http\Controllers;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('id')->get();

        return response()->json($services);
    }
}
