<?php

namespace App\Http\Controllers;
use App\Models\Checklist;
use App\Models\OrderChecklist;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;

class ChecklistController extends Controller
{

    use HttpResponses;
    
    public function index($orderId)
    {

        $checklistResponse = [];

        $checklist = OrderChecklist::where('order_id', $orderId)->orderBy('id')->get(['checklist_id', 'checked']);
        $checklistTitles = Checklist::orderBy('id')->get('type');

        if ($checklist && $checklistTitles) {

            foreach ($checklist as $index => $checklistItem) {

                $checklistItem->type = $checklistTitles[$index]->type;
                $checklistResponse[] = $checklistItem;
            }

            return response()->json($checklistResponse);

        } else {
            return $this->error(
                'Provided order ID does not exist',
                'Błąd ID zamówienia',
                500
            );
        }
    }

    public function update($orderId, Request $request)
    {
        $checklistRequestData = $request->all();

        $checklistRelatedToOrder = OrderChecklist::where('order_id', $orderId)->get();

        if (count($checklistRelatedToOrder) === 0) {
            return $this->error(
                'ORDER_UPDATE_ERROR',
                'Błąd aktualizacji zamówienia',
                500
            );
        }

        try {
            foreach ($checklistRequestData as $checklistId => $checkedStatus) {
                OrderChecklist::where('order_id', $orderId)
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
            'SUCCESSFUL_CHECKLIST_UPDATE',
            'Pomyślna aktualizacja listy zadań',
            200
        );
    }
}
