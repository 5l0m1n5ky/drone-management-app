<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Notification;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UpdateNotificationTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }
    
    function generateUniqueId()
    {
        do {
            $id = random_int(1, 999);
        } while (Notification::where('id', $id)->exists());

        return $id;
    }

    /** @test */
    public function successfully_mark_notification_as_seen(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->create(['role' => 'user']);

        $notification = Notification::factory()->create([
            'user_id' => $user->id
        ]);

        $response = $this->actingAs($user)->withSession(['banned' => false])->put('/api/notifications', [
            'notificationId' => $notification->id
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        $dataContent = $response->decodeResponseJson()['data'];

        $messageContent = $response->decodeResponseJson()['message'];

        $this->assertTrue($messageContent === 'Zaktualizowano status powiadomienia');

        $this->assertTrue($dataContent === 'NOTIFICATION_UPDATED');

        $notification->delete();

        $user->delete();
    }

    /** @test */
    public function unsuccessfull_attempt_mark_notification_as_seen(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->create(['role' => 'user']);

        $notification = Notification::factory()->create([
            'user_id' => $user->id
        ]);

        $response = $this->actingAs($user)->withSession(['banned' => false])->put('/api/notifications', [
            'notificationId' => $this->generateUniqueId()
        ]);

        $response->assertStatus(status: 500)->assertJsonStructure([
            'data',
            'message'
        ]);

        $dataContent = $response->decodeResponseJson()['data'];

        $messageContent = $response->decodeResponseJson()['message'];

        $this->assertTrue($messageContent === 'Bład aktualizacji powiadomienia');

        $this->assertTrue(condition: $dataContent === 'NOTIFICATION_UPDATE_ERROR');

        $notification->delete();

        $user->delete();
    }
}
