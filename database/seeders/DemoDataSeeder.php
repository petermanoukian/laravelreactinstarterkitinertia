<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Cat;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('12345678');

        // Create 10 superadmins
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => 'Superadmin ' . $i,
                'email' => $i === 1 ? 'super@super.com' : "superadmin$i@example.com",
                'password' => $password,
                'role' => 'superadmin',
            ]);
        }

        // Create 10 admins
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => 'Admin ' . $i,
                'email' => "admin$i@example.com",
                'password' => $password,
                'role' => 'admin',
            ]);
        }

        // Create 10 users
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => 'User ' . $i,
                'email' => "user$i@example.com",
                'password' => $password,
                'role' => 'user',
            ]);
        }

        // Create 20 categories
        for ($i = 1; $i <= 20; $i++) {
            Cat::create([
                'name' => 'Category ' . $i,
            ]);
        }
    }
}
