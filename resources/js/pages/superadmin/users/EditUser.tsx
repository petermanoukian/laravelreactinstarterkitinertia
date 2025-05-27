import React, { useEffect , useState} from 'react';
import {  Head,useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { route } from '@/ziggy';
import customAxios from '@/lib/axios';

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

    const { data, setData, post, put, processing, errors, progress } = useForm({
    id: userx.id,
    name: userx.name || '',
    email: userx.email || '',
    password: '',
    role: userx.role || 'user',
    img: null as File | null,
    filer: null as File | null,
  });

  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

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

  const [emailExists, setEmailExists] = useState(false);

  const validate = () => {
    const errors: { [key: string]: string } = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid.';
    } else if (emailExists) {
      errors.email = 'This email is already in use.';
    }

    // Password is optional on edit, but if entered, check min length
    if (data.password && data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return; // stop submit if client-side validation fails
    }

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


  const checkEmailEdit = async (email: string) => {
    try {
      const response = await customAxios.post('/superadmin/users/check-email-edit', {
        email,
        id: userx.id,
      });

      setEmailExists(response.data.exists);
      
    } catch (error) {
      console.error(error);
    }
  };



  return (

      <>
            <Head title="Edit User" />
            <AppLayout>

                <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto"
                encType="multipart/form-data" >

                <div>
                    <label>Role:</label>
                    <select
                    value={data.role}
                    onChange={(e) => {
                      setData('role', e.target.value);
                      setLocalErrors((prev) => ({ ...prev, role: '' }));
                    }}
                    className="w-full border rounded p-2"
                    >
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    </select>
                  {localErrors.role && <div className="text-red-500 text-sm">{localErrors.role}</div>}

                    {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
                </div>



                {/* Name */}
                <div>
                    <label>Name:</label>
                    <input
                    type="text"
                    value={data.name} 
                    onChange={e => {
                      setData('name', e.target.value);
                      setLocalErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className="w-full border rounded p-2"
                    />
                    {localErrors.name && <div className="text-red-500 text-sm">{localErrors.name}</div>}
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                {/* Email */}
                <div>
                    <label>Email:</label>
                    <input
                    type="email"
                    value={data.email}
                     onChange={(e) => {
                      setData('email', e.target.value);
                      setLocalErrors((prev) => ({ ...prev, email: '' }));
                      setEmailExists(false);
                    }}

                    onBlur={() => checkEmailEdit(data.email)}
                    className="w-full border rounded p-2"
                    />

                  {localErrors.email && <div className="text-red-500 text-sm mt-1">{localErrors.email}</div>}
                  {!localErrors.email && emailExists && (
                    <div className="text-red-500 text-sm mt-1">This email is already in use.</div>
                  )}
                  {!localErrors.email && !emailExists && errors.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>

                {/* Role */}


                {/* Password */}
                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={data.password}
                    onChange={e => {
                      setData('password', e.target.value);
                      setLocalErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className="w-full border rounded p-2"
                  />
                  {localErrors.password && <div className="text-red-500 text-sm">{localErrors.password}</div>}
                  {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                </div>



                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white 
                  text-sm font-medium rounded cursor-pointer hover:bg-blue-700">
                  Upload Image

                  <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;

                        // Clear any previous errors
                        let error = '';

                        if (file) {
                        const allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                        if (!allowedImgTypes.includes(file.type)) {
                            error = 'Invalid image format.';
                        } else if (file.size > 9520 * 1024) {
                            error = 'Image must be less than 9.3 MB.';
                        }

                        // If no error, set image and preview
                        if (!error) {
                            setData(prev => ({ ...prev, img: file }));
                            const reader = new FileReader();
                            reader.onload = () => {
                            if (typeof reader.result === 'string') {
                                setPreviewUrl(reader.result);
                            }
                            };
                            reader.readAsDataURL(file);
                        } else {
                            setPreviewUrl(null);
                            setData(prev => ({ ...prev, img: null }));
                        }
                        } else {
                        setPreviewUrl(null);
                        setData(prev => ({ ...prev, img: null }));
                        }

                        setLocalErrors(prev => ({ ...prev, img: error }));
                    }}
                    />

                    {localErrors.img && <div className="text-red-500 text-sm">
                   Local error for img: {localErrors.img}
                    </div>}
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
                  onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;

                        let error = '';

                        if (file) {
                        const allowedFileTypes = [
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'text/plain',
                            'image/jpeg',
                            'image/jpg',
                            'image/png',
                            'image/gif',
                            'image/webp',
                        ];

                        if (!allowedFileTypes.includes(file.type)) {
                            error = 'Invalid file format.';
                        } else if (file.size > 9520 * 1024) {
                            error = 'File must be less than 9.3 MB.';
                        }

                        if (!error) {
                            setData(prev => ({ ...prev, filer: file }));
                        } else {
                            setData(prev => ({ ...prev, filer: null }));
                        }
                        } else {
                        setData(prev => ({ ...prev, filer: null }));
                        }

                        setLocalErrors(prev => ({ ...prev, filer: error }));
                    }}
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

                  <button
                    type="submit"
                    disabled={
                      processing || Object.values(localErrors).some((v) => v !== '') || emailExists
                    }
                    className={` px-4 py-2 text-white ${
                      processing || Object.values(localErrors).some((v) => v !== '') || emailExists
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'cursor-pointer bg-blue-500'
                    }`}
                  >
                    Update User
                  </button>

                </form>
    </AppLayout>
    </>
  );
};

export default EditUser;
