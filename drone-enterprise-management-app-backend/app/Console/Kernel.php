<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\User;
use Illuminate\Support\Facades\Log;


class Kernel extends ConsoleKernel
{

    protected $commands = [
        'App\Console\Commands\DeleteUnconfirmedUsers'
    ];
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('app:delete-unconfirmed-users')->hourly()->timezone('Europe/Warsaw');

        $schedule->command('app:clear-inactive-sessions')->daily()->timezone('Europe/Warsaw');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
