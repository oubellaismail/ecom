<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Address;
use Illuminate\Http\Request;
use App\Http\Requests\Addresses\StoreAddressRequest;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    /**
     * Show the authenticated user's address.
     */
    public function show()
    {
        $user = Auth::user();
        $address = $user->address()->with('country')->first(); // Include country in the response

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $address
        ]);
    }

    /**
     * Store a new address for the authenticated user.
     */
    public function store(StoreAddressRequest $request)
    {
        $user = Auth::user();

        if ($user->address) {
            return response()->json([
                'success' => false,
                'message' => 'Address already exists. Use update instead.'
            ], 400);
        }

        $address = Address::create([
            'address_line1' => $request['address_line1'],
            'address_line2' => $request['address_line2'],
            'city' => $request['city'],
            'region' => $request['region'],
            'postal_code' => $request['postal_code'],
            'country_id' => Country::where('code', $request['country_code'])->first()->id,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Address created successfully'
        ], 201);
    }  

    /**
     * Update the authenticated user's address.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $address = $user->address;

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'No address found. Create an address first.'
            ], 404);
        }

        $validated = $request->validate([
            'unit_number' => 'nullable|string|max:10',
            'street_number' => 'nullable|string|max:10',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country_id' => 'required|exists:countries,id',
        ]);

        $address->update($validated);

        return response()->json([
            'success' => true,
            'data' => $address,
            'message' => 'Address updated successfully'
        ]);
    }
}
