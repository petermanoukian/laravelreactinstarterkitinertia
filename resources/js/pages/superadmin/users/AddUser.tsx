// resources/js/pages/superadmin/AddUser.tsx
import { Head, useForm , usePage  } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';


export default function AddUser() {

const searchParams = new URLSearchParams(window.location.search);
const selectedRole = searchParams.get('role') || 'user';

    const { data: datax, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: selectedRole ,
        img: null,     // Optional image file
        filer: null,
    });

    const { auth } = usePage().props as {
        auth: { user: { name: string; email: string } };
    };

    const [emailExists, setEmailExists] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    useEffect(() => {
        if (datax.email) {
            const timeout = setTimeout(() => {
                axios.post('/superadmin/users/check-email', { email: datax.email })
                    .then((res) => setEmailExists(res.data.exists))
                    .catch(() => setEmailExists(false));
            }, 500); // Delay to avoid over-requesting

            return () => clearTimeout(timeout); // Clean up
        }
    }, [datax.email]);
    
    const [localErrors, setLocalErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        role?: string;
        img?: string;
        filer?: string;
    }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof localErrors = {};

            // Basic text fields
            if (!datax.name.trim()) {
                newErrors.name = 'Name is required.';
            }

            if (!datax.email.trim()) {
                newErrors.email = 'Email is required.';
            } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(datax.email)) {
                newErrors.email = 'Invalid email format.';
            } else if (emailExists) {
                newErrors.email = 'Email is already taken.';
            }

            if (!datax.password.trim()) {
                newErrors.password = 'Password is required.';
            } else if (datax.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters.';
            }

            if (!datax.role) {
                newErrors.role = 'Role is required.';
            } else if (!['user', 'admin', 'superadmin'].includes(datax.role)) {
                newErrors.role = 'Invalid role selected.';
            }

            // Validate image file
            if (datax.img) {
                const allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedImgTypes.includes(datax.img.type)) {
                    newErrors.img = 'Invalid image format.';
                } else if (datax.img.size > 9520 * 1024) {
                    newErrors.img = 'Image must be less than 9.3 MB.';
                }
            }

            // Validate document/file upload
            if (datax.filer) {
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
                if (!allowedFileTypes.includes(datax.filer.type)) {
                    newErrors.filer = 'Invalid file format.';
                } else if (datax.filer.size > 9520 * 1024) {
                    newErrors.filer = 'File must be less than 9.3 MB.';
                }
            }

            // Show client-side errors
            setLocalErrors(newErrors);

            if (Object.keys(newErrors).length > 0) {
                return; // Stop submission
    }



        
       if (!emailExists) 
        {
            post('/superadmin/user/add');
        }  

    };

    const checkEmail = async (email: string) => {
        if (!email) return;

        try {
            const response = await axios.post(route('superadmin.users.checkEmail'), { email });
            setEmailExists(response.data.exists);
        } catch (error) {
            console.error("Email check failed", error);
        }
    };

    return (
        <>
            <Head title="Add User" />
            <AppLayout>
                <div className="p-12"> 
                <h1 className="text-2xl font-bold mb-4">Add User</h1>
                <p>
                    <Link href="/superadmin/users" prefetch 
                    className ="bg-blue-600 text-blue-700 rounded
                    hover:bg-blue-200 hover:text-blue-500
                    py-3 mb-3 px-4 text-white hover:text-blue-500">
                        &raquo; View Userss
                    </Link>
                </p>


                <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-w-md"
                autoComplete="off">
                    
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={datax.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full border p-2"
                        />
                        {localErrors.name && <div className="text-red-500 text-sm">{localErrors.name}</div>}
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    <div>
                        <label>Email   </label>
                        
                            <input
                                type="email"
                                name="add_user_email" // 👈 not "email"
                                autoComplete="off"
                                value={datax.email}
                                onChange={(e) => setData('email', e.target.value)}
                                onBlur={(e) => checkEmail(e.target.value)}
                                className="w-full border p-2"
                            />
                            {emailExists && (
                                <div className="text-red-500 text-sm mt-1">
                                    This email is already in use.
                                </div>
                            )}
                        {localErrors.email && <div className="text-red-500 text-sm">{localErrors.email}</div>}

                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={datax.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full border p-2"
                        />
                        {localErrors.password && <div className="text-red-500 text-sm">{localErrors.password}</div>}
                        {errors.password && <div className="text-red-500">{errors.password}</div>}
                    </div>

                    <div>
                        <label>Role</label>
                        <select
                            value={datax.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full border p-2"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                        </select>
                        {localErrors.role && <div className="text-red-500 text-sm">{localErrors.role}</div>}
                        {errors.role && <div className="text-red-500">{errors.role}</div>}
                    </div>


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>

                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded cursor-pointer hover:bg-blue-700">
                            Upload Image
                            <input
                            type="file"
                            name="img"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setData('img', file);

                                // Optional: For preview
                                if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const result = reader.result;
                                    if (typeof result === 'string') {
                                    setPreviewUrl(result);
                                    }
                                };
                                reader.readAsDataURL(file);
                                }
                            }}
                            className="hidden"
                            />
                        </label>

                        {/* 👇 Image Preview if selected */}
                        {datax.img && typeof datax.img !== 'string' && (
                            <div className="mt-3">
                            <img
                                src={previewUrl}
                                alt="Selected Preview"
                                className="w-32 h-32 object-cover rounded border shadow"
                            />
                            </div>
                        )}

               
                        {localErrors.img && <div className="text-red-500 text-sm">{localErrors.img}</div>}
                        {errors.img && <div className="text-red-500 text-sm mt-1">{errors.img}</div>}
                        </div>


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>

                        <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded cursor-pointer hover:bg-green-700">
                            Upload File
                            <input
                                type="file"
                                name="filer"
                                accept=".pdf,.doc,.docx,.txt,image/*"
                                onChange={(e) => setData('filer', e.target.files?.[0] ?? null)}
                                className="hidden"
                            />
                        </label>

                        {datax.filer && (
                            <div className="mt-2 text-sm text-gray-600">
                                Selected: {typeof datax.filer === 'string' ? datax.filer : datax.filer.name}
                            </div>
                        )}
                        {localErrors.filer && <div className="text-red-500 text-sm">{localErrors.filer}</div>}
                        {errors.filer && <div className="text-red-500 text-sm mt-1">{errors.filer}</div>}
                    </div>

                    <button type="submit" disabled={processing} 
                    className=" cursor-pointer bg-blue-500 text-white px-4 py-2">
                        Create
                    </button>
                </form>
                </div>
            </AppLayout>
        </>
    );
}
