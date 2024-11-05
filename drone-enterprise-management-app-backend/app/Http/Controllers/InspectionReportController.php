<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Requests\StoreInspectionReportRequest;
use App\Http\Requests\IndexInspectionReportRequest;
use App\Models\InspectionReport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InspectionReportController extends Controller
{

    use HttpResponses;

    public function index(IndexInspectionReportRequest $request)
    {

        // $request->validated($request->all());

        // $inspectionReport = DB::table('states')->where('order_id', $request->id)->first();

        // return 


    }

    public function store(StoreInspectionReportRequest $request)
    {

        $request->validated($request->all());

        $orderId = $request->orderId;
        $reportFile = $request->file('reportFile');

        try {
            $reportFilePath = $reportFile->store('reports');

            InspectionReport::create([
                'order_id' => $orderId,
                'report_file_path' => $reportFilePath
            ]);

            return $this->success(
                'Wygenerowano raport',
                'INSPECTION_REPORT_GENERATED',
                200
            );

        } catch (\Exception $exception) {
            return $this->error(
                $exception,
                'REPORT_GENERATE_ERROR',
                500
            );
        }
    }

    public function download($orderId)
    {

        $inspectionReport = DB::table('inspection_reports')->where('order_id', $orderId)->first();

        $reportFilePath = $inspectionReport->report_file_path;

        if (Storage::exists($reportFilePath)) {
            // return Storage::download($reportFilePath);
            // return $this->success(
            //     'Powinno pobrać',
            //     'INSPECTION_REPORT_GENERATED',
            //     200
            // );
            return Storage::download($reportFilePath);
        } else {
            return $this->error(
                'Błąd pobierania raportu',
                'REPORT_GENERATE_ERROR',
                500
            );
        }
    }
}
