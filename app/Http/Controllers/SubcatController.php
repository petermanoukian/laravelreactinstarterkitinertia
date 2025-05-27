<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cat;
use App\Models\Subcat;
use App\Models\Prod;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class SubcatController extends Controller
{
    
    public function indexSuperAdmin(Request $request, $catid = null)
    {
        $cats = Cat::select('id', 'name')->get(); // don't forget ->get()

        // Prefer request()->catid if available, fallback to route param
        $finalCatId = $request->input('catid') ?? $catid;

        $categoryName = null;
        if ($finalCatId) {
            $category = Cat::find($finalCatId);
            $categoryName = $category?->name;
        }

        $query = Subcat::query()->select('id', 'name', 'catid');

        if ($finalCatId) {
            $query->where('catid', $finalCatId);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');

        if (in_array($sortField, ['id', 'name', 'catid']) &&
            in_array($sortDirection, ['asc', 'desc'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        //$subs = $query->with('cat')->paginate(5)->withQueryString();


        $subs = $query
        ->with(['cat' => function ($q) {
            $q->withCount('subcats'); // Get subcategory count per category
        }])
        ->withCount('subprods')
        ->paginate(5)
        ->withQueryString();

        return Inertia::render('superadmin/shop/ViewSub', [
            'subs' => $subs,
            'cats' => $cats,
            'catid' => (int) $finalCatId, // Used to select the dropdown item
            'categoryName' => $categoryName,
            'filters' => [
                'search' => $request->search,
                'catid' => $finalCatId,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
        ]);
    }

 
    public function createsuperadmin(Request $request,  $catid='')
    {
        $finalCatId = $request->input('catid') ?? $catid;
        $cats = Cat::query()->select('id', 'name')->get();
		$categoryName = '';		
		if ($finalCatId) 
        {
			$category = Cat::find($finalCatId);
			$categoryName = $category ? $category->name : null;
		}
        return Inertia::render('superadmin/shop/AddSub' , [
            'cats' => $cats, 
            'categoryName' => $categoryName, 
            'catid' => $finalCatId,
        ]);
    }


    public function storesuperadmin(Request $request)
    {
		$validated = $request->validate([
			'name' => [
				'required',
				'string',
				'max:255',
				Rule::unique('subcats')->where(function ($query) use ($request) {
					return $query->where('catid', $request->catid);
				}),
			],
			'catid' => 'required|numeric|exists:cats,id',
		]);
		$name = $validated['name'];
		$catid = $validated['catid'];
        Subcat::create([
            'name'     => $name, 
            'catid' => $catid,
        ]);
        return redirect()->route('superadmin.subs.index')->with('success', 'Record created successfully');
    }

    public function editsuperadmin($id)
    {
        $cats = Cat::query()->select('id', 'name')->get();
        $row = Subcat::findOrFail($id); 
        return Inertia::render('superadmin/shop/EditSub', [
            'sub' => $row, 'cats' => $cats,
        ]);
    }


    public function updatesuperadmin(Request $request, $id)
    {
        $row = Subcat::find($id);
        if (!$row) 
        {
            return redirect()->back()->withErrors(['Record not found.']);    
        }

        $validated = $request->validate([
			'name' => [
				'required',
				'string',
				'max:255',
				Rule::unique('subcats')->where(function ($query) use ($request) {
					return $query->where('catid', $request->catid);
				})->ignore($id),
			],
			'catid' => 'required|numeric|exists:cats,id',
		]);
		$name = $validated['name'];
		$catid = $validated['catid'];
        $row->update(   [
            'name' => $name, 
            'catid' => $catid]);

        return redirect()->route('superadmin.subs.index')->with('success', 'Updated successfully');
    }

    public function destroysuperadmin($id)
    {
        

        $row = Subcat::find($id);

        if (!$row) {
            return response()->json(['message' => 'not found.'], 404);
        }
        $row->subprods()->delete();
        $row->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }

    public function destroyAllsuperadmin(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:subcats,id',
        ]);

        Prod::whereIn('subid', $request->ids)->delete();
        $count = Subcat::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "$count record(s) deleted successfully.",
        ]);
    }



    public function checkSubCatsuperadmin(Request $request)
	{
		$request->validate([
			'name' => 'required',
			'catid' => 'required|integer',
		]);

		$exists = Subcat::where('name', $request->name)->where('catid', $request->catid)->exists();

		return response()->json(['exists' => $exists]);
	}

	public function checkSubCatEditsuperadmin(Request $request)
	{
		$request->validate([
			'name' => 'required',
			'catid' => 'required|integer',
			'id' => 'required|integer',
		]);

        /*
        \Log::info('Checking for existing subcat', [
            'name' => $request->name,
            'catid' => $request->catid,
            'id' => $request->id,
        ]);
        */
        $match = Subcat::where('name', $request->name)
            ->where('catid', $request->catid)
            ->where('id', '!=', $request->id)
            ->first();

        /* \Log::info('Matched subcat:', ['match' => $match]); */

        return response()->json(['exists' => !!$match]);
	}


}
