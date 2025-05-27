<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatController;

Route::middleware(['auth',  'superadmin'])->prefix('superadmin')->group(function () {

    Route::get('/cats/view', [CatController::class, 'indexsuperadmin'])
        ->name('superadmin.cats.index');

    Route::get('/cat/add', [CatController::class, 'createsuperadmin'])
        ->name('superadmin.cat.create');

    Route::post('/cat/store', [CatController::class, 'storesuperadmin'])
        ->name('superadmin.cat.store');

    Route::get('/cat/{id}/edit', [CatController::class, 'editsuperadmin'])
        ->name('superadmin.cat.edit');

    Route::match(['post', 'put'], '/cat/update/{id}', [CatController::class, 'updatesuperadmin'])
        ->name('superadmin.cat.update');

    Route::delete('/cat/delete/{id}', [CatController::class, 'destroysuperadmin'])
        ->name('superadmin.cat.destroy');

    Route::post('/cats/delete-multiple', [CatController::class, 'destroyAllsuperadmin'])
        ->name('superadmin.cats.destroyAll');

    Route::post('/cats/check-cat-superadmin', [CatController::class, 'checkCatSuperAdmin'])
        ->name('superadmin.cats.checkCat');

    Route::post('/cats/check-cat-edit-superadmin', 
    [CatController::class, 'checkCatEditSuperAdmin'])
    ->name('superadmin.cats.checkCatEdit');
        

});
