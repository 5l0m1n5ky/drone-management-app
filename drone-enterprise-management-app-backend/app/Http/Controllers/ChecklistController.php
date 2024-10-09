<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;

class ChecklistController extends Controller
{

    use HttpResponses;
    public function index($orderId)
    {

        $checklistResponse = [];

        $checklist = DB::table('order_checklist')->where('order_id', $orderId)->orderBy('id')->get(['checklist_id', 'checked']);
        $checklistTitles = DB::table('checklist')->orderBy('id')->get('type');

        if ($checklist && $checklistTitles) {

            foreach ($checklist as $index => $checklistItem) {

                $checklistItem->type = $checklistTitles[$index]->type;
                $checklistResponse[] = $checklistItem;
            }

            return response()->json($checklistResponse);

        } else {
            return $this->error(
                'Provided order ID does not exist',
                'ORDER ID ERROR',
                500
            );
        }
    }

    public function update($orderId, Request $request)
    {
        $checklistRequestData = $request->all();

        $checklistRelatedToOrder = DB::table('order_checklist')->where('order_id', $orderId)->get();

        if (count($checklistRelatedToOrder) === 0) {
            return $this->error(
                'No such order',
                'ORDER_UPDATE_ERROR',
                500
            );
        }

        try {
            foreach ($checklistRequestData as $checklistId => $checkedStatus) {
                DB::table('order_checklist')
                    ->where('order_id', $orderId)
                    ->where('checklist_id', $checklistId)
                    ->update(['checked' => $checkedStatus]);
            }
        } catch (\ErrorException $errorException) {
            return $this->error(
                'update error',
                $errorException,
                500
            );
        }

        return $this->success(
            'update succesfull',
            'SUCCESSFUL_CHECKLIST_UPDATE',
            200
        );
    }
}
