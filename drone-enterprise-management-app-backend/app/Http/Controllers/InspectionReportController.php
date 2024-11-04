<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Requests\StoreInspectionReportRequest;
use App\Http\Requests\IndexNGetInspectionReportRequest;
use App\Models\InspectionReport;
use Illuminate\Support\Facades\DB;

class InspectionReportController extends Controller
{

    use HttpResponses;

    public function index(IndexNGetInspectionReportRequest $request)
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

    public function download(IndexNGetInspectionReportRequest $request)
    {

        $request->validated($request->all());



    }
}
