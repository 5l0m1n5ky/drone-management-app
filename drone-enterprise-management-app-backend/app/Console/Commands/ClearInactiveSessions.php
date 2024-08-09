<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClearInactiveSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-inactive-sessions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Task used to clear inactive sessions from database if driver for storing sessions keys is set to 'database'";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (env('SESSION_DRIVER') == 'database') {
            DB::table('sessions')->where('last_activity', '<', Carbon::now()->subWeek())->delete();
        }
    }
}
