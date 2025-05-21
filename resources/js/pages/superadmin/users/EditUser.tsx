import React, { useEffect , useState} from 'react';
import {  Head,useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { route } from '@/ziggy';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  img2?: string;  // image URL
  filer?: string; // file URL
}

interface Props {
  userx: User;
}

const EditUser: React.FC<Props> = ({ userx }) => {

    const { data, setData, post, put, errors, progress } = useForm({
    name: userx.name || '',
    email: userx.email || '',
    password: '',
    role: userx.role || 'user',
    img: null as File | null,
    filer: null as File | null,
  });

  // If userx changes, reset the form state:
  useEffect(() => {
    setData({
      name: userx.name || '',
      email: userx.email || '',
      password: '',
      role: userx.role || 'user',   
      img: null,
      filer: null,
    });
  }, [userx, setData]); // add setData to deps to avoid lint errors

  // handleSubmit stays the same
  /*
  const handleSubmitold = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: Record<string, any> = {
      name: data.name,
      email: data.email,
      role: data.role,
      _method: 'put', // ⬅️ Laravel will treat it as PUT
    };

    if (data.img) submitData.img = data.img;
    if (data.filer) submitData.filer = data.filer;

    post(route('superadmin.user.update', { id: userx.id }), submitData, {
      forceFormData: true,
      preserveScroll: true,
    });
  };
  */

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('superadmin.user.update', { id: userx.id }), {
      ...data,
      _method: 'put',
    }, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setData(prev => ({
          ...prev,
          img: null,
          filer: null,
        }));
      },
    });

  };




  return (

      <>
            <Head title="Edit User" />
            <AppLayout>

                <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto"
                encType="multipart/form-data" >
                {/* Name */}
                <div>
                    <label>Name:</label>
                    <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full border rounded p-2"
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                {/* Email */}
                <div>
                    <label>Email:</label>
                    <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className="w-full border rounded p-2"
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>

                {/* Role */}
                <div>
                    <label>Role:</label>
                    <select
                    value={data.role}
                    onChange={e => setData('role', e.target.value)}
                    className="w-full border rounded p-2"
                    >
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    </select>
                    {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
                </div>

                {/* Password */}
                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  {errors.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  )}
                </div>


                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded cursor-pointer hover:bg-blue-700">
                  Upload Image

                    <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setData({ ...data, img: file });

                            // Show preview of new image
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setPreviewUrl(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setPreviewUrl(null);
                            }
                          }}
                        />




                  </label>

                {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded object-cover shadow" />
                    </div>
                  )}

                  {/* 👉 Otherwise, show existing image if available */}
                  {!previewUrl && userx.img2 && (
                    <div className="mt-2">
                      <img src={`/${userx.img2}`} alt="Current" className="w-20 h-20 rounded object-cover shadow" />
                    </div>
                  )}


                    {errors.img && <div className="text-red-500 text-sm">{errors.img}</div>}
                </div>

                {/* File Upload */}
                <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachment (PDf, TXT, DOC,DOcX,Image)</label>

                  <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded cursor-pointer hover:bg-green-700">
                    Upload File
                    <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    onChange={e => setData({
                    ...data,
                    filer: e.target.files ? e.target.files[0] : null,
                    })}
                    className="hidden"
                 
                    />
                    </label>
                    {userx.filer && (
                    <div className="mt-2">
                        <a href={`/${userx.filer}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View current file
                        </a>
                    </div>
                    )}
                    {errors.filer && <div className="text-red-500 text-sm">{errors.filer}</div>}
                </div>

                {/* Upload progress */}
                {progress && (
                    <div className="w-full bg-gray-200 rounded h-2 mt-4">
                    <div
                        className="bg-green-500 h-2 rounded"
                        style={{ width: `${progress.percentage}%` }}
                    />
                    </div>
                )}

                {/* Submit */}
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Update User
                </button>
                </form>
    </AppLayout>
    </>
  );
};

export default EditUser;
