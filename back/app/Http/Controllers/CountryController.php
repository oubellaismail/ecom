<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index(){

        $countries = Country::all();

        return response()->json([
            'success' => true,
            'data' => $countries->pluck('name', 'code'),
            'message' => "Countries retrieved successfully"
        ]);
    }
}
