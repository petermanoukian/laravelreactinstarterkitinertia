<?php
namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;




class SuperAdminController extends Controller
{
    

    public function index(Request $request)
    {
        $query = User::query()
            ->select('id', 'name', 'email', 'role', 'img', 'img2', 'filer');

        // ✅ Filter by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // ✅ Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // ✅ Sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');


        if (in_array($sortField, ['id', 'name', 'email', 'role']) &&
            in_array($sortDirection, ['asc', 'desc'])) {
            $query->orderBy($sortField, $sortDirection);
        }


        // ✅ Pagination with query string
        $users = $query->paginate(5)->withQueryString();

        return Inertia::render('superadmin/users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
        ]);

    }


    
    public function create()
    {
        return Inertia::render('superadmin/users/AddUser');
    }

    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $exists = User::where('email', $request->email)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function edit($id)
    {
        $useredit = User::findOrFail($id); 
        return Inertia::render('superadmin/users/EditUser', [
            'userx' => $useredit,
        ]);
    }

    public function store(Request $request)
    {
        $customPath = config('path.public_path');

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => 'required|in:user,admin,superadmin',
            'img'      => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:9520',
            'filer'    => 'nullable|mimes:pdf,doc,docx,txt,jpeg,jpg,png,gif,webp|max:9520',
        ]);

        $imagePath = null;
        $thumbPath = null;
        $filePath = null;

        $uuid = Str::uuid()->toString();

        // ✅ Handle image upload and thumbnail
        if ($request->hasFile('img')) {
            $imgFile = $request->file('img');
            $imgExt = $imgFile->getClientOriginalExtension();
            $imgName = $uuid . '.' . $imgExt;

            $imgFullPath = $customPath . 'uploads/img/' . $imgName;
            $thumbFullPath = $customPath . 'uploads/img/thumb/' . $imgName;

            // Ensure directories exist
            if (!file_exists($customPath . 'uploads/img/thumb')) {
                mkdir($customPath . 'uploads/img/thumb', 0777, true);
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

            $imagePath = 'uploads/img/' . $imgName;
            $thumbPath = 'uploads/img/thumb/' . $imgName;
        }

        // ✅ Handle file upload
        if ($request->hasFile('filer')) {
            $file = $request->file('filer');
            $fileExt = $file->getClientOriginalExtension();
            $fileName = $uuid . '.' . $fileExt;

            $fileDir = $customPath . 'uploads/filer/';

            if (!file_exists($fileDir)) {
                mkdir($fileDir, 0777, true);
            }

            $file->move($fileDir, $fileName);
            $filePath = 'uploads/filer/' . $fileName;
        }

        // ✅ Save user
        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role'     => $validated['role'],
            'img'      => $imagePath,
            'img2'     => $thumbPath,
            'filer'    => $filePath,
        ]);

        return redirect()->route('superadmin.users.index')->with('success', 'User created successfully');
    }



    public function update(Request $request, $id)
    {
 
        $userx = User::find($id);
        if (!$userx) {
            return redirect()->back()->withErrors(['User not found.']);
            
        }
        $customPath = config('path.public_path');

        // Validate including email check excluding current user
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:superadmin,admin,user',
            'img'      => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:9520',
            'filer'    => 'nullable|mimes:pdf,doc,docx,txt,jpeg,jpg,png,gif,webp|max:9520',
        ]);

        $data = $request->only(['name', 'email', 'role']);


        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }
        $uuid = Str::uuid()->toString();

        // ✅ Handle image upload and thumbnail
        if ($request->hasFile('img')) {
            $imgFile = $request->file('img');
            $imgExt = $imgFile->getClientOriginalExtension();
            $imgName = $uuid . '.' . $imgExt;

            $imgFullPath = $customPath . 'uploads/img/' . $imgName;
            $thumbFullPath = $customPath . 'uploads/img/thumb/' . $imgName;

            // Ensure directories exist
            if (!file_exists($customPath . 'uploads/img/thumb')) {
                mkdir($customPath . 'uploads/img/thumb', 0777, true);
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

            $imagePath = 'uploads/img/' . $imgName;
            $thumbPath = 'uploads/img/thumb/' . $imgName;
            $data['img']  = $imagePath;
            $data['img2'] = $thumbPath;
        }

        // ✅ Handle file upload
        if ($request->hasFile('filer')) {
            $file = $request->file('filer');
            $fileExt = $file->getClientOriginalExtension();
            $fileName = $uuid . '.' . $fileExt;

            $fileDir = $customPath . 'uploads/filer/';

            if (!file_exists($fileDir)) {
                mkdir($fileDir, 0777, true);
            }

            $file->move($fileDir, $fileName);
            $filePath = 'uploads/filer/' . $fileName;
            $data['filer'] = $filePath;
        }

        $userx->update($data);
        return redirect()->route('superadmin.users.index')->with('success', 'User updated successfully');
    }


    public function destroy($id)
    {
        
        if (auth()->id() == $id) 
        {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function destroyAll(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
        ]);

        
        $selfId = auth()->id();

        if (in_array($selfId, $request->ids)) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $count = User::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "$count user(s) deleted successfully.",
        ]);
    }



}
