<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdController;

Route::middleware(['auth',  'superadmin'])->prefix('superadmin')->group(function () {

    Route::get('/prods/view/{catid?}/{subid?}', [ProdController::class, 'indexsuperadmin'])
        ->name('superadmin.prods.index');

    Route::get('/prod/add/{catid?}/{subid?}', [ProdController::class, 'createsuperadmin'])
        ->name('superadmin.prod.create');

    Route::get('/subcatsbycat/{catid}', [ProdController::class, 'getSubcatsByCat']);
    

    Route::post('/prod/store', [ProdController::class, 'storesuperadmin'])
        ->name('superadmin.prod.store');

    Route::get('/prod/{id}/edit', [ProdController::class, 'editsuperadmin'])
        ->name('superadmin.prod.edit');

    Route::match(['post', 'put'], '/prod/update/{id}', [ProdController::class, 'updatesuperadmin'])
        ->name('superadmin.prod.update');

    Route::delete('/prod/delete/{id}', [ProdController::class, 'destroysuperadmin'])
        ->name('superadmin.prod.destroy');

    Route::post('/prods/delete-multiple', [ProdController::class, 'destroyAllsuperadmin'])
        ->name('superadmin.prods.destroyAll');

    Route::post('/prods/check-prod-superadmin', [ProdController::class, 'checkProdSuperAdmin'])
        ->name('superadmin.prods.checkProd');

    Route::post('/prods/check-prod-edit-superadmin', 
    [ProdController::class, 'checkProdEditSuperAdmin'])
    ->name('superadmin.prods.checkProdEdit');

    Route::post('/prods/check-prodcode-superadmin', [ProdController::class, 'checkProdCodeSuperAdmin'])
        ->name('superadmin.prods.checkProdCode');

    Route::post('/prods/check-prodcode-edit-superadmin', 
    [ProdController::class, 'checkProdCodeEditSuperAdmin'])->name('superadmin.prods.checkProdCodeEdit');
        

});
