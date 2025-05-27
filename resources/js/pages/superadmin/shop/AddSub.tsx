import { Head, useForm , usePage  } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

type AddSubProps = {
  cats: { id: number; name: string }[];
  catid?: number | string;
};

const AddSub: React.FC<AddSubProps> = ({ cats, catid }) => {

    const initialCatid = catid ? String(catid) : '';
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        catid: initialCatid,
    });

    const [subExists, setSubExists] = useState(false);

    /*
    useEffect(() => {
        if (data.name) {
            const timeout = setTimeout(() => {
                axios.post('/superadmin/cats/check-cat-superadmin', { name: data.name })
                    .then((res) => setSubExists(res.data.exists))
                    .catch(() => setSubExists(false));
            }, 500); // Delay to avoid over-requesting

            return () => clearTimeout(timeout); // Clean up
        }
    }, [data.name]);
    */
    const [localErrors, setLocalErrors] = useState<{
        name?: string;
        catid?: string;
    }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof localErrors = {};

        if (!data.name.trim()) {
            newErrors.name = 'SubCategoy Name is required.';
        }
        if (!data.catid.trim()) {
            newErrors.catid = 'Categoy is required.';
        }
        setLocalErrors(newErrors);

        if (Object.keys(newErrors).length > 0) 
        {
            return; // Stop submission
        }

        if (!subExists) 
        {
            post('/superadmin/sub/store');
        }  

    };


    useEffect(() => {
      if (data.catid.trim()) {
        setLocalErrors((prev) => ({ ...prev, catid: '' }));
      }
    }, [data.catid]);

    useEffect(() => {
      if (data.name.trim()) {
        setLocalErrors((prev) => ({ ...prev, name: '' }));
      }
    }, [data.name]);

    /*
    const checkSub = async (name: string) => {
        if (!name) return;


        try {
            const response = await axios.post(route('superadmin.subs.checkSubCat'), 
            { name , catid: data.catid });
            setSubExists(response.data.exists);
        } catch (error) {
            console.error("check failed", error);
        }
    };
    */ 

    const checkSub = async (name: string) => {
      try {
        const response = await axios.post(route('superadmin.subs.checkSubCat'), {
          name,
          catid: data.catid,
        });
        setSubExists(response.data.exists);
      } catch (error) {
        console.error("Check failed", error);
        setSubExists(false);
      }
    };


    useEffect(() => {
      if (data.name && data.catid) {
        checkSub(data.name);
      }
    }, [data.catid, data.name]);

    const [selectedCat, setSelectedCat] = useState(
      cats.find((cat) => cat.id === Number(data.catid)) || null
    )
    const [query, setQuery] = useState("")

    const filteredCats =
      query === ""
        ? cats
        : cats.filter((cat) =>
            cat.name.toLowerCase().includes(query.toLowerCase())
          )
      useEffect(() => {
        setData("catid", selectedCat ? selectedCat.id.toString() : "")
    }, [setData,selectedCat])


    return (
        
        <>
            <Head title="Add SubCategory" />
            <AppLayout>
                <div className="p-12"> 
                <h1 className="text-2xl font-bold mb-4">Add SubCategory</h1>
                <p>
                    <Link 
                       href={
                        initialCatid
                        ? `/superadmin/subs/view?catid=${initialCatid}`
                        : `/superadmin/subs/view`
                    }
                    prefetch 
                    className ="bg-blue-600 text-blue-700 rounded
                    hover:bg-blue-200 hover:text-blue-500
                    py-3 mb-3 px-4 text-white hover:text-blue-500">
                        &raquo; View Subcategories
                    </Link>
                </p>


                <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-w-md"
                autoComplete="off">
                 {/*
                    <div className="mb-4">
                      <label>Category:</label>
                    
                      <select
                        className="w-full border p-2"
                        value={data.catid}
                        onChange={(e) => setData('catid', e.target.value)}
                      >
                        <option value="">-- Select Category --</option>
                        {cats.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  */} 

                    <div className="mb-4">
                      <label className="block mb-1">Category:</label>
                      <Combobox value={selectedCat} onChange={setSelectedCat}>
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
                        <label>Name</label>
                        <input
                            type="text"
                            value={data.name}
                            
                            onChange={(e) => {
                                setData('name', e.target.value);
                                setSubExists(false);
                                setLocalErrors(prev => ({ ...prev, name: '' }));
                            }}
                            //onBlur={(e) => checkSub(e.target.value)}
                            className="w-full border p-2"
                        />
                        {localErrors.name && <div className="text-red-500 text-sm">{localErrors.name}</div>}
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || Object.values(localErrors).some((v) => v !== '')
                            || subExists}
                        className={` px-4 py-2 text-white ${
                            processing || Object.values(localErrors).some((v) => v !== '') || subExists
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



export default AddSub