<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {

        $name = $name = $request->last_name . '' . $request->first_name;
        $slug = Str::slug( $name );

        // Check if slug already exists, append a number if needed
        $originalSlug = $slug;
        $count = 1;

        while ( User::where( 'username', $slug )->exists() ) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $slug,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
    
        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
        ], 201);
    }

    public function login(LoginRequest $request)
    {

        $user = User::where(function ($query) use ($request) {
            $query->where('email', $request['email']);
        })->first();

        if (!$user || !Hash::check($request['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $accessToken = $user->createToken('access_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token', ['*'], now()->addDays(30))->plainTextToken; 

        return response()->json([
            'success' => true,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'user' => $user->only(['first_name', 'last_name', 'username']),
            'is_admin' => $user->role_id == User::ROLE_ADMIN,
        ]);
    }

    public function refresh_token(Request $request) {
        $refreshToken = $request->input('refresh_token');
        
        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token is required'], 400);
        }
        
        $token = PersonalAccessToken::findToken($refreshToken);
        
        if (!$token || !$token->can('refresh_token')) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }
        
        $user = $token->tokenable;
        $accessToken = $user->createToken('access_token')->plainTextToken;
    
        return response()->json([
            'access_token' => $accessToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }
}
