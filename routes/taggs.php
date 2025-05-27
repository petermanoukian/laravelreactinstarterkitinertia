<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaggController;

Route::middleware(['auth',  'superadmin'])->prefix('superadmin')->group(function () {

    Route::get('/taggs/view', [TaggController::class, 'indexsuperadmin'])
        ->name('superadmin.taggs.index');

    Route::get('/tagg/add', [TaggController::class, 'createsuperadmin'])
        ->name('superadmin.tagg.create');

    Route::post('/tagg/store', [TaggController::class, 'storesuperadmin'])
        ->name('superadmin.tagg.store');

    Route::get('/tagg/{id}/edit', [TaggController::class, 'editsuperadmin'])
        ->name('superadmin.tagg.edit');

    Route::match(['post', 'put'], '/tagg/update/{id}', [TaggController::class, 'updatesuperadmin'])
        ->name('superadmin.tagg.update');

    Route::delete('/tagg/delete/{id}', [TaggController::class, 'destroysuperadmin'])
        ->name('superadmin.tagg.destroy');

    Route::post('/taggs/delete-multiple', [TaggController::class, 'destroyAllsuperadmin'])
        ->name('superadmin.taggs.destroyAll');

    Route::post('/taggs/check-tagg-superadmin', [TaggController::class, 'checkTaggSuperAdmin'])
        ->name('superadmin.taggs.checkTagg');


    Route::post('/taggs/check-tagg-edit-superadmin', 
    [TaggController::class, 'checkTaggEditSuperAdmin'])
    ->name('superadmin.taggs.checkTaggeEdit');
        

});
