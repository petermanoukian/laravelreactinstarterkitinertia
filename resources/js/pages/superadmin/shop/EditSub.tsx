import React, { useEffect , useState , useRef } from 'react';
import {  Head,useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { route } from '@/ziggy';
import customAxios from '@/lib/axios';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';


interface Subcat {
  id: number;
  name: string;
  catid: number|string;
}

interface Cat {
  id: number;
  name: string;
}
interface Props {
  sub: Subcat;
}


const EditSub: React.FC<Props> = ({ sub }) => {
    //console.log('Full props Line 27:', usePage().props);
    const { cats = [] } = usePage<{ cats: Cat[] }>().props;

    //console.log('cats line 30 ', cats);

    const [selectedCat, setSelectedCat] = useState<Cat | null>(null);


    const { data, setData, post, put, processing, errors } = useForm({
        id: sub.id,
        name: sub.name,
        catid: sub.catid,
    });
    
    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

    /*
    useEffect(() => {
        setData({
        name: sub.name,
        catid: sub.catid,

        });
    }, [sub, setData]);
    */
    const [subExists, setSubExists] = useState(false);


    console.log('selectedCat line 54 ', selectedCat);
    useEffect(() => {
    if (Array.isArray(cats) && sub?.catid != null) {
        const match = cats.find((cat) => cat.id === Number(sub.catid)) || null;
        setSelectedCat(match);
    }
    }, [cats, sub]);

     console.log('selectedCat line 62 ', selectedCat);

    
    const validate = () => {
        const errors: { [key: string]: string } = {};
    
        if (!data.name.trim()) 
        {
          errors.name = 'Name is required.';
        }
        if (!data.catid) {
            errors.catid = 'Categoy is required.';
        }
        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!validate()) {
        return; // stop submit if client-side validation fails
      }
  
      post(route('superadmin.sub.update', { id: sub.id }), {
        ...data,
        _method: 'put',
      }, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          setData(prev => ({
            ...prev,
  
          }));
        },
      });
  
    };
    
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear previous timer if input changes fast
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // Skip check if no name or no selectedCat
        if (!data.name.trim() || !selectedCat) {
        setSubExists(false);
        return;
        }

        debounceTimer.current = setTimeout(() => {
        const checkSubEdit = async () => {
            try {
            const response = await customAxios.post('/superadmin/subs/check-subcat-edit-superadmin', {
                name: data.name.trim(),
                catid: selectedCat?.id || null,
                id: sub.id,
            });
            setSubExists(response.data.exists);
            } catch (error) {
            console.error(error);
            }
        };
        checkSubEdit();
        }, 500); // 500ms debounce delay

        // Cleanup on unmount or next effect run
        return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [data.name, selectedCat, sub.id]);

    const checkSubEdit = async (name: string) => 
    {
        try {
        const response = await customAxios.post('/superadmin/subs/check-subcat-edit-superadmin', {
            name:name.trim(),
            catid: selectedCat?.id || null,
            id: sub.id,
        });
  
        setSubExists(response.data.exists);
        
        } catch (error) {
        console.error(error);
        }
    };
 
    const [query, setQuery] = useState('');

    // Filtered categories based on query
    const filteredCats = query === ''
        ? cats
        : cats.filter((cat) =>
            cat.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    
    <>
        <Head title="Edit SubCategory" />
        <AppLayout>
            <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto"
            encType="multipart/form-data" >


                <div className="mb-4">
                <label className="block mb-1">Category:</label>
                [{selectedCat?.id}]
               <Combobox
                    value={selectedCat}
                    onChange={(cat) => {
                        setSelectedCat(cat);
                        setData('catid', cat?.id); // <-- Sync selected category with form state
                    }}
               >


                <div className="relative">
                    <div className="relative w-full">
                    <Combobox.Input
                        className="w-full border p-2 pr-10"
                        displayValue={(cat) => cat?.name || ""}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search categories..."
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                    </div>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                    {filteredCats.length === 0 ? (
                        <div className="p-2 text-gray-500">Nothing found.</div>
                    ) : (
                        filteredCats.map((cat) => (
                        <Combobox.Option
                            key={cat.id}
                            value={cat}
                            className={({ active }) =>
                            `cursor-pointer select-none p-2 ${
                                active ? "bg-blue-500 text-white" : "text-gray-900"
                            }`
                            }
                        >
                            {cat.name}
                        </Combobox.Option>
                        ))
                    )}
                    </Combobox.Options>
                </div>
                </Combobox>
                {subExists && <div className="text-red-500 text-sm">SubCategory already exists.</div>}
                {localErrors.catid && <div className="text-red-500 text-sm">{localErrors.catid}</div>}
                {errors.catid && <div className="text-red-500">{errors.catid}</div>}
            </div>


            <div>
                <label>Title:</label>
                <input
                type="text"
                value={data.name}
                onChange={(e) => {
                setData('name', e.target.value);
                setLocalErrors((prev) => ({ ...prev, name: '' }));
                setSubExists(false);
                }}

               
                className="w-full border rounded p-2"
                />

            {localErrors.name && <div className="text-red-500 text-sm mt-1">{localErrors.name}</div>}
            {!localErrors.name && subExists && (
                <div className="text-red-500 text-sm mt-1">Already in use.</div>
            )}
            {!localErrors.name && !subExists && errors.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
            )}
            </div>

            {/* Submit */}

            <button
                type="submit"
                disabled={
                    Object.values(localErrors).some((v) => v !== '') || subExists
                }
                className={` px-4 py-2 text-white ${
                processing || Object.values(localErrors).some((v) => v !== '') || subExists
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'cursor-pointer bg-blue-500'
                }`}
            >
                Update 
            </button>

            </form>
    </AppLayout>
    </>

  )
}

export default EditSub

