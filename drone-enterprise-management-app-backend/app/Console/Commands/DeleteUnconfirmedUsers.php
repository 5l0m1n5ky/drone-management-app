<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\User;

class DeleteUnconfirmedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-unconfirmed-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete users who have not confirmed their registration within 24 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $users = User::whereNull('email_verified_at')
            ->where('updated_at', '<', $now->subDay())
            ->get();

        foreach ($users as $user) {
            $user->delete();
        }

        \Log::info("[Scheduler] Deleted unconfirmed users who registered more than 24 hours ago.");
    }
}
