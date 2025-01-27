<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Requests\StoreInspectionReportRequest;
use App\Models\InspectionReport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InspectionReportController extends Controller
{

    use HttpResponses;

    public function store(StoreInspectionReportRequest $request)
    {

        $request->validated($request->all());

        $orderId = $request->orderId;
        $reportFile = $request->file('reportFile');

        try {

            $inspectionReport = InspectionReport::where('order_id', $orderId)->first();
            $reportFilePath = '';


            if ($inspectionReport) {
                $reportFilePath = $inspectionReport->report_file_path;

                if (Storage::exists($reportFilePath)) {

                    Storage::delete($reportFilePath);
                    $reportFilePath = $reportFile->store('reports');
                    InspectionReport::where('order_id', $orderId)->delete();
                } else {
                    $reportFilePath = $reportFile->store('reports');
                }
            } else {
                $reportFilePath = $reportFile->store('reports');

            }

            InspectionReport::create([
                'order_id' => $orderId,
                'report_file_path' => $reportFilePath
            ]);

            return $this->success(
                'INSPECTION_REPORT_GENERATED',
                'Wygenerowano raport',
                200
            );

        } catch (\Exception $exception) {
            return $this->error(
                $exception,
                'Bład generowania raportu',
                500
            );
        }
    }

    public function download($orderId)
    {

        $inspectionReport = InspectionReport::where('order_id', $orderId)->first();

        $reportFilePath = $inspectionReport->report_file_path;

        if (Storage::exists($reportFilePath)) {
            return Storage::download($reportFilePath);
        } else {
            return $this->error(
                'REPORT_GENERATE_ERROR',
                'Błąd pobierania raportu',
                500
            );
        }
    }
}
