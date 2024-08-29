<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\OrderDetails;
use Illuminate\Support\Facades\DB;
use App\Traits\HttpResponses;

use Illuminate\Http\Request;

class OrderController extends Controller
{

    use HttpResponses;

    public function index()
    {

        $user = auth()->user();

        if ($user->role === 'admin') {
            $orders = DB::table('orders')->orderBy('id')->get();
            return response()->json($orders);

        } else if ($user->role === 'user') {
            $orders = DB::table('orders')->where('id', $user->id)->orderBy('id')->get();
            return response()->json($orders);

        } else {
            return $this->error(
                'You do not have such as previleges to make that request',
                'DENIED',
                500
            );
        }

    }

    public function store(OrderRequest $orderRequest)
    {

        $orderRequest->validated($orderRequest->all());

        $user = auth()->user();
        $userId = $user->id;

        $orderDetails = OrderDetails::create([
            'subservice_id' => $orderRequest->subservice_id,
            'amount' => $orderRequest->amount,
            'background_music_id' => $orderRequest->bgMusicId,
            'format' => $orderRequest->format,
            'report' => $orderRequest->report
        ]);

        $order = Order::create([
            'service_id' => $orderRequest->service_id,
            'user_id' => $userId,
            'state_id' => 1,
            'order_details_id' => $orderDetails->id,
            'price_brutto' => $orderRequest->price,
            'date' => $orderRequest->date,
            'order_latitude' => $orderRequest->latitude,
            'order_longitude' => $orderRequest->longitude,
            'customer_name' => $orderRequest->name,
            'customer_surname' => $orderRequest->surname,
            'nip' => $orderRequest->nip,
            'streetName' => $orderRequest->streetName,
            'streetNumber' => $orderRequest->streetNumber,
            'apartmentNumber' => $orderRequest->apartmentNumber,
            'zip' => $orderRequest->zip,
            'city' => $orderRequest->city,
            'order_alias' => $orderRequest->alias,
            'customer_comment' => $orderRequest->description
        ]);
    }
}
