<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Cat;
use App\Models\Subcat;
use App\Models\Prod;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CatController extends Controller
{  
    public function indexSuperAdmin(Request $request)
    {
        $query = Cat::query()->select('id', 'name')
            ->withCount(['subcats', 'catprods']);
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');
        if (in_array($sortField, ['id', 'name']) &&
            in_array($sortDirection, ['asc', 'desc'])) {
            $query->orderBy($sortField, $sortDirection);
        }
        $cats = $query->paginate(5)->withQueryString();
        return Inertia::render('superadmin/shop/ViewCat', [
            'cats' => $cats,
            'filters' => [
                'search' => $request->search,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
        ]);
    }

    public function createsuperadmin()
    {
        return Inertia::render('superadmin/shop/AddCat');
    }

    public function storesuperadmin(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
        ]);
        Cat::create([
            'name'     => $validated['name'],
        ]);
        return redirect()->route('superadmin.cats.index')->with('success', 'Record created successfully');
    }

    public function editsuperadmin($id)
    {
        $row = Cat::findOrFail($id); 
        return Inertia::render('superadmin/shop/EditCat', [
            'cat' => $row,
        ]);
    }


    public function updatesuperadmin(Request $request, $id)
    {
        $row = Cat::find($id);
        if (!$row) 
        {
            return redirect()->back()->withErrors(['Record not found.']);    
        }
        $request->validate([
            'name' => 'required|string|max:255',   
        ]);
        $data = $request->only(['name']);
        $row->update($data);
        return redirect()->route('superadmin.cats.index')->with('success', 'Updated successfully');
    }

    public function destroysuperadmin($id)
    {
        $row = Cat::find($id);
        if (!$row) {
            return response()->json(['message' => 'not found.'], 404);
        }
        $row->catprods()->delete();
        $row->subcats()->delete();
        $row->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }

    public function destroyAllsuperadmin(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:cats,id',
        ]);
        Prod::whereIn('catid', $request->ids)->delete();
        Subcat::whereIn('catid', $request->ids)->delete();

        $count = Cat::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "$count record(s) deleted successfully.",
        ]);
    }

    public function checkCatSuperAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);

        $exists = Cat::where('name', $request->name)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function checkCatEditSuperAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'id' => 'required|integer', // current user's ID
        ]);

        $exists = Cat::where('name', $request->name)
                    ->where('id', '!=', $request->id) // Exclude current record
                    ->exists();
        return response()->json(['exists' => $exists]);
    }

}
