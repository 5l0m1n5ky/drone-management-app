<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetails;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\OrderRequest;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{

    use HttpResponses;

    protected $emailController;

    public function __construct(EmailController $emailController)
    {
        $this->emailController = $emailController;
    }

    public function index()
    {
        $user = Auth::user();

        $services = collect(DB::table('services')->get());
        $subservices = collect(DB::table('subservices')->get());
        $states = collect(DB::table('states')->get());
        $bgMusic = collect(DB::table('background_music')->get());

        try {

            if ($user && $user->role === 'admin') {

                $orderData = [];
                $orders = DB::table('orders')->orderBy('id')->get();

                foreach ($orders as $order) {

                    $orderDetailsId = $order->order_details_id;
                    $orderDetails = DB::table('order_details')->where('id', $orderDetailsId)->orderBy('id')->first();
                    $orderItem = [
                        'id' => $order->id,
                        'service' => $services->where('id', $order->service_id)->pluck('service_type')->first(),
                        'subservice' => $subservices->where('id', $orderDetails->subservice_id)->pluck('subservice')->first(),
                        'amount' => $orderDetails->amount,
                        'bgMusic' => $orderDetails->background_music_id ? $bgMusic->where('id', $orderDetails->background_music_id)->pluck('type')->first() : null,
                        'format' => $orderDetails->format,
                        'report' => $orderDetails->report,
                        'latitude' => $order->order_latitude,
                        'longitude' => $order->order_longitude,
                        'date' => $order->date,
                        'alias' => $order->order_alias,
                        'description' => $order->customer_comment,
                        'price' => $order->price_brutto,
                        'state' => $states->where('id', $order->state_id)->pluck('state_type')->first(),
                        'stateColor' => $states->where('id', $order->state_id)->pluck('color')->first(),
                        'customerName' => $order->customer_name,
                        'customerSurname' => $order->customer_surname,
                        'nip' => $order->nip,
                        'streetName' => $order->street_name,
                        'streetNumber' => $order->street_number,
                        'apartmentNumber' => $order->apartment_number,
                        'zip' => $order->zip,
                        'city' => $order->city,
                        'customerComment' => $order->customer_comment,
                        'email' => $order->email,
                        'tel' => $order->tel,
                    ];

                    $orderData[] = $orderItem;
                }
                return response()->json($orderData);

            } else if ($user && $user->role === 'user') {

                $orderData = [];
                $orders = DB::table('orders')->where('user_id', $user->id)->orderBy('id')->get();
                foreach ($orders as $order) {

                    $orderDetailsId = $order->order_details_id;
                    $orderDetails = DB::table('order_details')->where('id', $orderDetailsId)->orderBy('id')->first();
                    $orderItem = [
                        'id' => $order->id,
                        'service' => $services->where('id', $order->service_id)->pluck('service_type')->first(),
                        'subservice' => $subservices->where('id', $orderDetails->subservice_id)->pluck('subservice')->first(),
                        'amount' => $orderDetails->amount,
                        'bgMusic' => $orderDetails->background_music_id ? $bgMusic->where('id', $orderDetails->background_music_id)->pluck('type')->first() : null,
                        'format' => $orderDetails->format,
                        'report' => $orderDetails->report,
                        'latitude' => $order->order_latitude,
                        'longitude' => $order->order_longitude,
                        'date' => $order->date,
                        'alias' => $order->order_alias,
                        'description' => $order->customer_comment,
                        'price' => $order->price_brutto,
                        'state' => $states->where('id', $order->state_id)->pluck('state_type')->first(),
                        'stateColor' => $states->where('id', $order->state_id)->pluck('color')->first(),
                        'customerName' => $order->customer_name,
                        'customerSurname' => $order->customer_surname,
                        'nip' => $order->nip,
                        'streetName' => $order->street_name,
                        'streetNumber' => $order->street_number,
                        'apartmentNumber' => $order->apartment_number,
                        'customerComment' => $order->customer_comment,
                        'email' => $order->email,
                        'tel' => $order->tel,
                    ];

                    $orderData[] = $orderItem;
                }
                return response()->json($orderData);

            } else {
                return $this->error(
                    'You do not have such as previleges to make that request',
                    'DENIED',
                    500
                );
            }
        } catch (\ErrorException $errorException) {
            return $this->error(
                $errorException,
                'DENIED',
                500
            );
        }
    }

    public function indexOrderDates()
    {
        if (Auth::user()) {
            $orderDates = Order::select('date')->orderBy('id')->get();

            return response()->json($orderDates);
        } else {
            return $this->error(
                'You have no previleges to make this request',
                'ACCESS_DENIED',
                500
            );
        }
    }

    public function store(OrderRequest $orderRequest)
    {
        $orderRequest->validated($orderRequest->all());

        $admin = DB::table('users')->where('role', 'admin')->first();

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
            'street_name' => $orderRequest->streetName,
            'street_number' => $orderRequest->streetNumber,
            'apartment_number' => $orderRequest->apartmentNumber,
            'zip' => $orderRequest->zip,
            'city' => $orderRequest->city,
            'email' => $orderRequest->email,
            'tel' => $orderRequest->tel,
            'order_alias' => $orderRequest->alias,
            'customer_comment' => $orderRequest->description
        ]);

        if ($order && $orderDetails) {

            $link = env('FRONTEND_URL') . '/user/panel/orders/' . $order->id;

            $this->emailController->notifyAdminNewOrder($admin->email, $link);

            return $this->success(
                'Zamówienie zostało złożone',
                'ORDER_PLACED',
                200
            );
        } else {
            return $this->error(
                'Wystąpił błąd w składaniu zamówienia',
                'ORDER_PLACING_FAILED',
                500
            );
        }
    }
}
