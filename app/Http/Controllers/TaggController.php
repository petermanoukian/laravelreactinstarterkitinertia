<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Tagg;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaggController extends Controller
{
     public function indexSuperAdmin(Request $request)
    {
        //->withCount(['prodtaggs'])
        $query = Tagg::query()->select('id', 'name');

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
        $taggs = $query->paginate(5)->withQueryString();
        return Inertia::render('superadmin/tagg/ViewTagg', [
            'taggs' => $taggs,
            'filters' => [
                'search' => $request->search,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
        ]);
    }

    public function createsuperadmin()
    {
        return Inertia::render('superadmin/tagg/AddTagg');
    }

    public function storesuperadmin(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
        ]);
        Tagg::create([
            'name'     => $validated['name'],
        ]);
        return redirect()->route('superadmin.taggs.index')->with('success', 'Record created successfully');
    }

    public function editsuperadmin($id)
    {
        $row = Tagg::findOrFail($id); 
        return Inertia::render('superadmin/tagg/EditTagg', [
            'tagg' => $row,
        ]);
    }


    public function updatesuperadmin(Request $request, $id)
    {
        $row = Tagg::find($id);
        if (!$row) 
        {
            return redirect()->back()->withErrors(['Record not found.']);    
        }
        $request->validate([
            'name' => 'required|string|max:255',   
        ]);
        $data = $request->only(['name']);
        $row->update($data);
        return redirect()->route('superadmin.taggs.index')->with('success', 'Updated successfully');
    }

    public function destroysuperadmin($id)
    {
        $row = Tagg::find($id);
        if (!$row) {
            return response()->json(['message' => 'not found.'], 404);
        }
        //$row->prodtaggs()->delete();
        $row->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }

    public function destroyAllsuperadmin(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:taggs,id',
        ]);
        //Prodtagg::whereIn('taggid', $request->ids)->delete();
        $count = Tagg::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "$count record(s) deleted successfully.",
        ]);
    }

    public function checkTaggSuperAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);

        $exists = Tagg::where('name', $request->name)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function checkTaggEditSuperAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'id' => 'required|integer', // current user's ID
        ]);

        $exists = Tagg::where('name', $request->name)
                    ->where('id', '!=', $request->id) // Exclude current record
                    ->exists();
        return response()->json(['exists' => $exists]);
    }
}
