import { Head, useForm , usePage  } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';

const AddTagg = () => {


    const { data: datax, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const [taggExists, setTaggExists] = useState(false);

    useEffect(() => {
        if (datax.name) {
            const timeout = setTimeout(() => {
                axios.post('/superadmin/taggs/check-tagg-superadmin', { name: datax.name })
                    .then((res) => setTaggExists(res.data.exists))
                    .catch(() => setTaggExists(false));
            }, 500); // Delay to avoid over-requesting

            return () => clearTimeout(timeout); // Clean up
        }
    }, [datax.name]);
    
    const [localErrors, setLocalErrors] = useState<{
        name?: string;
    }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof localErrors = {};

            // Basic text fields
            if (!datax.name.trim()) {
                newErrors.name = 'Tag Name is required.';
            }

            setLocalErrors(newErrors);

            if (Object.keys(newErrors).length > 0) 
                {
                return; // Stop submission
        }
 
       if (!taggExists) 
        {
            post('/superadmin/tagg/store');
        }  

    };

    const checkTagg = async (name: string) => {
        if (!name) return;

        try {
            const response = await axios.post(route('superadmin.taggs.checkTagg'), { name });
            setTaggExists(response.data.exists);
        } catch (error) {
            console.error("check failed", error);
        }
    };


    return (
        
        <>
            <Head title="Add Tagg" />
            <AppLayout>
                <div className="p-12"> 
                <h1 className="text-2xl font-bold mb-4">Add Tagg</h1>
                <p>
                    <Link href="/superadmin/taggs/view" prefetch 
                    className ="bg-blue-600 text-blue-700 rounded
                    hover:bg-blue-200 hover:text-blue-500
                    py-3 mb-3 px-4 text-white hover:text-blue-500">
                        &raquo; View Taggs
                    </Link>
                </p>


                <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-w-md"
                autoComplete="off">

                    
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={datax.name}
                            
                            onChange={(e) => {
                                setData('name', e.target.value);
                                setTaggExists(false);
                                setLocalErrors(prev => ({ ...prev, name: '' }));
                            }}
                            onBlur={(e) => checkTagg(e.target.value)}
                            className="w-full border p-2"
                        />
                        {taggExists && <div className="text-red-500 text-sm">Already exists.</div>}
                        {localErrors.name && <div className="text-red-500 text-sm">{localErrors.name}</div>}
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>


                    <button
                        type="submit"
                        disabled={processing || Object.values(localErrors).some((v) => v !== '')
                            || taggExists}
                        className={` px-4 py-2 text-white ${
                            processing || Object.values(localErrors).some((v) => v !== '') || taggExists
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 cursor-pointer'
                        }`}
                        >
                        Create
                    </button>

                    <button type="button" onClick={() => reset()} 
                    className="btn-blue-500 ml-2 px-4 py-2 bg-blue-500 text-white cursor-pointer mt-2">
                    Reset 
                    </button>


                </form>
                </div>
            </AppLayout>
        </>
    )




}

export default AddTagg