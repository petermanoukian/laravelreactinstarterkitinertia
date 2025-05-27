<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubcatController;

Route::middleware(['auth',  'superadmin'])->prefix('superadmin')->group(function () {

    Route::get('/subs/view/{catid?}', [SubcatController::class, 'indexsuperadmin'])
        ->name('superadmin.subs.index');

    Route::get('/sub/add/{catid?}', [SubcatController::class, 'createsuperadmin'])
        ->name('superadmin.sub.create');

    Route::post('/sub/store', [SubcatController::class, 'storesuperadmin'])
        ->name('superadmin.sub.store');

    Route::get('/sub/{id}/edit', [SubcatController::class, 'editsuperadmin'])
        ->name('superadmin.sub.edit');

    Route::match(['post', 'put'], '/sub/update/{id}', [SubcatController::class, 'updatesuperadmin'])
        ->name('superadmin.sub.update');

    Route::delete('/sub/delete/{id}', [SubcatController::class, 'destroysuperadmin'])
        ->name('superadmin.sub.destroy');

    Route::post('/subs/delete-multiple', [SubcatController::class, 'destroyAllsuperadmin'])
        ->name('superadmin.subs.destroyAll');

    Route::post('/subs/check-subcat-superadmin', [SubcatController::class, 'checkSubCatSuperAdmin'])
        ->name('superadmin.subs.checkSubCat');

    Route::post('/subs/check-subcat-edit-superadmin', 
    [SubcatController::class, 'checkSubCatEditSuperAdmin'])
    ->name('superadmin.subs.checkSubCatEdit');
        

});
