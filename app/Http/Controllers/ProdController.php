<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cat;
use App\Models\Subcat;
use App\Models\Prod;
use App\Models\Tagg;
use App\Models\Prodtagg;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;

class ProdController extends Controller
{
    public function indexSuperAdmin(Request $request, $catid = null, $subid = null)
    {
        $cats = Cat::select('id', 'name')->get(); 
      
        // Prefer request()->catid if available, fallback to route param
        $finalCatId = $request->input('catid') ?? $catid;
        $finalSubId = $request->input('subid') ?? $subid;
        $categoryName = null;
        if ($finalCatId) {
            $category = Cat::find($finalCatId);
            $categoryName = $category?->name;
        }
        $subCategoryName = null;
        $subs = Subcat::select('id', 'name', 'catid')->get();
        if ($finalSubId) {
            $subCategory = Subcat::find($finalSubId);
            $subCategoryName = $subCategory?->name;
            $subs = Subcat::where('catid', $finalCatId)->select('id', 'name', 'catid')->get();
        }

        $query = Prod::query()->
        select('id', 'name', 'catid', 'subid', 'img','img2','coder', 
        'ordd', 'vis', 'des', 'dess', 'prix', 'quan');

        $taggids = $request->input('taggids', []);

        if ($finalCatId) {
            $query->where('catid', $finalCatId);
        }

        if ($finalSubId) {
            $query->where('subid', $finalSubId);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if (!empty($taggids)) {
            $query->whereHas('taggs', function ($q) use ($taggids) {
                $q->whereIn('taggs.id', $taggids);
            });
        }

        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');

        if (in_array($sortField, ['id', 'name', 'catid', 'subid']) &&
            in_array($sortDirection, ['asc', 'desc'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $alltags = Tagg::select('id', 'name')->orderBy('name')->get();

        $prods = $query
            ->with([
                'cat' => function ($q) {
                    $q->withCount('catprods');
                },
                'sub' => function ($q2) {
                    $q2->withCount('subprods');
                },
                'taggs', // 👈 Add this to eager-load the tags
            ])
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('superadmin/shop/ViewProd', [
            'subs' => $subs,
            'cats' => $cats,
            'catid' => (int) $finalCatId, // Used to select the dropdown item
            'categoryName' => $categoryName,
            'subid' => (int) $finalSubId, // Used to select the dropdown item
            'subCategoryName' => $subCategoryName,
            'prods' => $prods,
            'alltags' => $alltags,
            'filters' => [
                'search' => $request->search,
                'catid' => $finalCatId,
                'subid' => $finalSubId,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
        ]);
    }

 
    public function createsuperadmin(Request $request,  $catid='' , $subid='')
    {
        $finalCatId = $request->input('catid') ?? $catid;
        $finalSubId = $request->input('subid') ?? $subid;
        $cats = Cat::query()->select('id', 'name')->get();

        $taggs = Tagg::select('id', 'name')->orderby('name', 'asc')->get();

		$categoryName = '';	
        //$subs = Subcat::query()->select('id', 'name', 'catid')->get();
        $subs=[]; 
        //$subs = collect(); 
		if ($finalCatId) 
        {
			$category = Cat::find($finalCatId);
			$categoryName = $category ? $category->name : null;
            $subs = Subcat::where('catid', $finalCatId)
                ->select('id', 'name', 'catid')
                ->get();
		}

        $subCategoryName = '';

        if ($finalSubId) 
        {
            $subCategory = Subcat::find($finalSubId);
            $subCategoryName = $subCategory ? $subCategory->name : null;
        }

        return Inertia::render('superadmin/shop/AddProd' , [
            'cats' => $cats, 
            'categoryName' => $categoryName, 
            'subs' => $subs, 
            'taggs' => $taggs,
            'subCategoryName' => $subCategoryName, 
            'subid' => $finalSubId, 
            'catid' => $finalCatId,
        ]);
    }

    public function getSubcatsByCat($catid)
    {
        $subs = Subcat::where('catid', $catid)
            ->select('id', 'name', 'catid')
            ->get();

        return response()->json(['subs' => $subs]);
    }


    public function storesuperadmin(Request $request)
    {
		$customPath = config('path.public_path');
        $validated = $request->validate([
			'name' => [
				'required',
				'string',
				'max:255',
				Rule::unique('prods')->where(function ($query) use ($request) {
					return $query->where('catid', $request->catid)
                        ->where('subid', $request->subid);
				}),
			],
			'catid' => 'required|numeric|exists:cats,id',
            'subid' => 'required|numeric|exists:subcats,id',
            'coder' => 'required|string|max:255|unique:prods,coder',
            'vis' => 'required|in:1,0',
            'ordd' => 'nullable|numeric',
            'img' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:9820',
            'filer'=> 'nullable|mimes:pdf,doc,docx,txt,jpeg,jpg,png,gif,webp|max:9820',
            'des' => 'nullable|string|max:2000',
            'dess' => 'nullable|string|max:20000',
            'prix' => 'nullable|numeric',
            'quan' => 'nullable|numeric',
            'taggstoadd' => 'nullable|array',
            'taggstoadd.*' => 'integer|exists:taggs,id',

		]);

        $uuid = Str::uuid()->toString();

        // ✅ Handle image upload and thumbnail
        if ($request->hasFile('img')) {
            $imgFile = $request->file('img');
            $imgExt = $imgFile->getClientOriginalExtension();
            $imgName = $uuid . '.' . $imgExt;

            $imgFullPath = $customPath . 'uploads/img/prod/' . $imgName;
            $thumbFullPath = $customPath . 'uploads/img/prod/thumb/' . $imgName;

            // Ensure directories exist
            if (!file_exists($customPath . 'uploads/img/prod/thumb')) {
                mkdir($customPath . 'uploads/img/prod/thumb', 0777, true);
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($imgFile->getPathname());

            if ($image->width() > 1500 || $image->height() > 1200) {
                $image->resize(1500, 1200, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            // Save original
            $image->save($imgFullPath);

            // Save thumbnail
            $manager->read($imgFile->getPathname())->cover(200, 200)->save($thumbFullPath);

            $imagePath = 'uploads/img/prod/' . $imgName;
            $thumbPath = 'uploads/img/prod/thumb/' . $imgName;
        }

        // ✅ Handle file upload
        if ($request->hasFile('filer')) {
            $file = $request->file('filer');
            $fileExt = $file->getClientOriginalExtension();
            $fileName = $uuid . '.' . $fileExt;

            $fileDir = $customPath . 'uploads/filer/prod/';

            if (!file_exists($fileDir)) {
                mkdir($fileDir, 0777, true);
            }

            $file->move($fileDir, $fileName);
            $filePath = 'uploads/filer/prod/' . $fileName;
        }

		$name = $validated['name'];
		$catid = $validated['catid'];
        $subid = $validated['subid'];
        $coder = $validated['coder'];
        $ordd = $validated['ordd'] ?? 1;
        $vis = $validated['vis'];

        $des = $validated['des'];
        $dess = $validated['dess'];
        $prix = $validated['prix'] ?? null;
        $quan = $validated['quan'] ?? 1;

        $prod = new Prod;
        $prod->name = $name;
        $prod->catid = $catid;
        $prod->subid = $subid;
        $prod->coder = $coder;
        $prod->ordd = $ordd;
        $prod->vis = $vis;
        $prod->des = $des;
        $prod->dess = $dess;
        $prod->prix = $prix;
        $prod->quan = $quan;
        $prod->img = $imagePath ?? null;
        $prod->img2 = $thumbPath ?? null;
        $prod->filer= $filePath ?? null;
        $prod->save();

        if ($request->filled('taggstoadd') && is_array($request->taggstoadd)) {
            $prod->taggs()->sync($request->taggstoadd);
        }

        return redirect()->route('superadmin.prods.index')->with('success', 'Record created successfully');
    }

    public function editsuperadmin($id)
    {
        $cats = Cat::query()->select('id', 'name')->get();
        $subs = Subcat::query()->select('id', 'name', 'catid')->get();
        $prod = Prod::with('taggs')->findOrFail($id);

        $allTaggs = Tagg::select('id', 'name')->orderby('name', 'asc')->get();
        $selectedTaggIds = $prod->taggs->pluck('id')->toArray();
        return Inertia::render('superadmin/shop/EditProd', [
            'prod' => $prod, 'cats' => $cats, 'subs' => $subs,
            'taggs' => $allTaggs,
            'selectedTaggIds' => $selectedTaggIds,
        ]);
    }


    public function updatesuperadmin(Request $request, $id)
    {
        $prod = Prod::find($id);
        if (!$prod) 
        {
            return redirect()->back()->withErrors(['Record not found.']);    
        }

        
        $validated = $request->validate([
			'name' => [
				'required',
				'string',
				'max:255',
				Rule::unique('prods')->where(function ($query) use ($request) {
					return $query->where('catid', $request->catid)
                        ->where('subid', $request->subid);
				})->ignore($request->id),
			],
			'catid' => 'required|numeric|exists:cats,id',
            'subid' => 'required|numeric|exists:subcats,id',
            'coder' => [
                'required',
                'string',
                'max:255',
                Rule::unique('prods', 'coder')->ignore($request->id),
            ],
            'vis' => 'required|in:1,0',
            'ordd' => 'nullable|numeric',
            'img' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:9520',
            'filer'=> 'nullable|mimes:pdf,doc,docx,txt,jpeg,jpg,png,gif,webp|max:9520',
            'des' => 'nullable|string|max:1000',
            'dess' => 'nullable|string|max:10000',
            'prix' => 'nullable|numeric',
            'quan' => 'nullable|numeric',
            'taggstoadd' => 'nullable|array',
            'taggstoadd.*' => 'integer|exists:taggs,id',

		]);

        $uuid = Str::uuid()->toString();

        // ✅ Ensure directories exist
        $customPath = config('path.public_path');
        if (!file_exists($customPath . 'uploads/img/prod/thumb')) {
            mkdir($customPath . 'uploads/img/prod/thumb', 0777, true);
        }
        if (!file_exists($customPath . 'uploads/filer/prod/')) {
            mkdir($customPath . 'uploads/filer/prod/', 0777, true);
        }


       // ✅ Preserve old values unless a new file is uploaded
        $imagePath = $prod->img;
        $thumbPath = $prod->thumb;
        $filePath  = $prod->filer;

        // ✅ Handle image upload and thumbnail
        if ($request->hasFile('img')) {
            $imgFile = $request->file('img');
            $imgExt = $imgFile->getClientOriginalExtension();
            $imgName = $uuid . '.' . $imgExt;

            $imgFullPath = $customPath . 'uploads/img/prod/' . $imgName;
            $thumbFullPath = $customPath . 'uploads/img/prod/thumb/' . $imgName;

            if (!file_exists(dirname($thumbFullPath))) {
                mkdir(dirname($thumbFullPath), 0777, true);
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($imgFile->getPathname());

            if ($image->width() > 1500 || $image->height() > 1200) {
                $image->resize(1500, 1200, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            $image->save($imgFullPath);
            $manager->read($imgFile->getPathname())->cover(200, 200)->save($thumbFullPath);

            $imagePath = 'uploads/img/prod/' . $imgName;
            $thumbPath = 'uploads/img/prod/thumb/' . $imgName;
        }

        // ✅ Handle file upload
        if ($request->hasFile('filer')) {
            $file = $request->file('filer');
            $fileExt = $file->getClientOriginalExtension();
            $fileName = $uuid . '.' . $fileExt;

            $fileDir = $customPath . 'uploads/filer/prod/';
            if (!file_exists($fileDir)) {
                mkdir($fileDir, 0777, true);
            }

            $file->move($fileDir, $fileName);
            $filePath = 'uploads/filer/prod/' . $fileName;
        }


		$name = $validated['name'];
		$catid = $validated['catid'];
        $subid = $validated['subid'];
        $coder = $validated['coder'];
        $ordd = $validated['ordd'] ?? 1;
        $vis = $validated['vis'];

        $des = $validated['des'];
        $dess = $validated['dess'];
        $prix = $validated['prix'] ?? null;
        $quan = $validated['quan'] ?? 1;


        $prod->name = $name;
        $prod->catid = $catid;
        $prod->subid = $subid;
        $prod->coder = $coder;
        $prod->ordd = $ordd;
        $prod->vis = $vis;
        $prod->des = $des;
        $prod->dess = $dess;
        $prod->prix = $prix;
        $prod->quan = $quan;
        $prod->img = $imagePath ?? null;
        $prod->img2 = $thumbPath ?? null;
        $prod->filer= $filePath ?? null;

   
        $prod->save();
        $prod->taggs()->sync($request->input('taggstoadd', []));
        return redirect()->route('superadmin.prods.index')->with('success', 'Updated successfully');
    }

    public function destroysuperadmin($id)
    {
        

        $row = Prod::find($id);

        if (!$row) {
            return response()->json(['message' => 'not found.'], 404);
        }

        $row->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }

    public function destroyAllsuperadmin(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:prods,id',
        ]);


        $count = Subcat::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "$count record(s) deleted successfully.",
        ]);
    }



    public function checkProdSuperAdmin(Request $request)
	{
		$request->validate([
			'name' => 'required',
			'catid' => 'required|integer',
            'subid' => 'required|integer',
		]);


     \Log::info('Checking for existing line 427 ', [
            'name' => $request->name,
            'catid' => $request->catid,
            'subid' => $request->subid,
        ]);
		$exists = Prod::where('name', $request->name)->where('catid', $request->catid)->
        where('subid', $request->subid)->
        exists();
         \Log::info('Matched result:', ['exists' => $exists]); 
		return response()->json(['exists' => $exists]);
	}

	public function checkProdEditSuperAdmin(Request $request)
	{
		$request->validate([
			'name' => 'required',
			'catid' => 'required|integer',
            'subid' => 'required|integer',
			'id' => 'required|integer',
		]);

        /*
        \Log::info('Checking for existing subcat', [
            'name' => $request->name,
            'catid' => $request->catid,
            'id' => $request->id,
        ]);
        */
        $match = Prod::where('name', $request->name)
            ->where('catid', $request->catid)
            ->where('subid', $request->subid)
            ->where('id', '!=', $request->id)
            ->first();

        /* \Log::info('Matched subcat:', ['match' => $match]); */

        return response()->json(['exists' => !!$match]);
	}


    public function checkProdCodeSuperAdmin(Request $request)
	{
		$request->validate([
			'coder' => 'required',
		]);
		$exists2 = Prod::where('coder', $request->coder)->exists();
		return response()->json(['exists2' => $exists2]);
	}

    public function checkProdCodeEditSuperAdmin(Request $request)
    {
        $request->validate([
            'coder' => 'required',
            'id' => 'required|integer',
        ]);

        $exists2 = Prod::where('coder', $request->coder)
            ->where('id', '!=', $request->id)
            ->exists();

        return response()->json(['exists2' => $exists2]);
    }




}
