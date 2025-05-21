<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Superadmin\SuperAdminController;

Route::middleware(['auth', 'verified'])->prefix('superadmin')->group(function () {
    Route::get('/adduser', [UserController::class, 'create']);
    Route::post('/users', [UserController::class, 'store']);
});


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::middleware(['auth', 'verified'])->prefix('superadmin')->group(function () {

    Route::get('/adduser', [SuperAdminController::class, 'create'])
        ->name('superadmin.user.create'); // ✅ Added name

    Route::get('/users', [SuperAdminController::class, 'index'])
        ->name('superadmin.users.index');

    Route::post('/user/add', [SuperAdminController::class, 'store'])
        ->name('superadmin.user.store'); // ✅ Added name

    Route::post('/users/check-email', [SuperadminController::class, 'checkEmail'])
        ->name('superadmin.users.checkEmail');

    Route::get('/user/{id}/edit', [SuperadminController::class, 'edit'])
        ->name('superadmin.user.edit');

    Route::match(['post', 'put'], '/user/update/{id}', [SuperadminController::class, 'update'])
        ->name('superadmin.user.update');

    Route::delete('/users/delete/{id}', [SuperadminController::class, 'destroy'])
        ->name('superadmin.users.destroy');

    Route::post('/users/delete-multiple', [SuperadminController::class, 'destroyAll'])
        ->name('superadmin.users.destroyAll');


    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
