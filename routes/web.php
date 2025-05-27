<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Superadmin\SuperAdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CatController;
require __DIR__.'/categories.php';
require __DIR__.'/subcats.php';
require __DIR__.'/prods.php';
require __DIR__.'/taggs.php';

/*
Route::middleware(['auth', 'verified'])->prefix('superadmin')->group(function () {
    Route::get('/adduser', [UserController::class, 'create']);
    Route::post('/users', [UserController::class, 'store']);
});

*/
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::middleware(['auth',  'superadmin'])->prefix('superadmin')->group(function () {

    Route::get('/adduser', [SuperAdminController::class, 'create'])
        ->name('superadmin.user.create'); 

    Route::get('/users', [SuperAdminController::class, 'index'])
        ->name('superadmin.users.index');

    Route::post('/user/add', [SuperAdminController::class, 'store'])
        ->name('superadmin.user.store'); 

    Route::post('/users/check-email', [SuperadminController::class, 'checkEmail'])
        ->name('superadmin.users.checkEmail');

    Route::post('/users/check-email-edit', [SuperadminController::class, 'checkEmailEdit'])
    ->name('superadmin.users.checkEmailEdit');
    
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
