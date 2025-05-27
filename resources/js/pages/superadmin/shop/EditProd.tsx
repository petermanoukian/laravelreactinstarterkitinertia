
import React, { useEffect , useState , useRef } from 'react';
import {  Head,useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { route } from '@/ziggy';
import customAxios from '@/lib/axios';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select';

interface Subcat {
  id: number;
  name: string;
  catid: number | string;
}

interface Cat {
  id: number;
  name: string;
}

interface Prod {
  id: number;
  catid: number | string;
  subid: number | string;
  name: string;
  coder: string;
  cat: Cat;
  des: string;
  dess: string;
  prix: number;
  quan: number;
  ordd: number;
  vis: '0' | '1';
  img?: string;
  img2?: string;
  filer?: string;
  sub: Subcat;
}

type Tagg = {
  id: number;
  name: string;
};

interface PageProps {
  prod: Prod;
  taggs: Tagg[];
  selectedTaggIds: number[];
  cats: Cat[];
  subs: Subcat[];
}

// Use PageProps as Props type here
const EditProd: React.FC = () => {
  // Single usePage call to get all props at once
  const { prod, taggs = [], selectedTaggIds = [], cats = [], subs = [] } = usePage<PageProps>().props;

  const editorRef = useRef<any>(null);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subcat | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, setData, post, put, processing, errors, progress } = useForm({
    id: prod.id,
    name: prod.name,
    catid: prod.catid,
    subid: prod.subid,
    coder: prod.coder,
    des: prod.des,
    dess: prod.dess,
    prix: prod.prix,
    quan: prod.quan,
    ordd: prod.ordd,
    vis: prod.vis,
    img: null as File | null,
    filer: null as File | null,
    taggstoadd: selectedTaggIds ?? [],  // Add initial tags here if you want
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
    const [prodExists, setProdExists] = useState(false);


    console.log('selectedCat line 54 ', selectedCat);
    useEffect(() => {
    if (Array.isArray(cats) && prod?.catid != null) {
        const match = cats.find((cat) => cat.id === Number(prod.catid)) || null;
        setSelectedCat(match);
    }
    }, [cats, prod]);

    useEffect(() => {
    if (Array.isArray(subs) && prod?.subid != null) {
        const match = subs.find((sub) => sub.id === Number(prod.subid)) || null;
        setSelectedSub(match);
    }
    }, [subs, prod]);

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
        if (!data.subid) {
            errors.subid = 'Subcategory is required.';
        }
        if (!data.coder.trim()) {
            errors.coder = 'Coder is required.';
        }
      // PRIX: can be null or number
      if (data.prix !== null && data.prix !== '' && isNaN(Number(data.prix))) {
        errors.prix = 'Prix must be a number or empty.';
      }

      const rawOrdd = data.ordd;
      if (rawOrdd == null || rawOrdd === undefined || rawOrdd === '') {
        data.ordd = 0;
      } else if (isNaN(Number(data.ordd))) {
        errors.ordd = 'Order must be a number.';
      }

      // QUAN: default to 1 if missing
      if (data.quan === null || data.quan === undefined || data.quan === '') {
        data.quan = 1;
      } else if (isNaN(Number(data.quan))) {
        errors.quan = 'Quantity must be a number.';
      }

      // VIS: must be 0 or 1 (number check)
        if (String(data.vis) !== '0' && String(data.vis) !== '1') {
        errors.vis = 'Visibility must be 0 or 1.';
        }


        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!validate()) {
        return; // stop submit if client-side validation fails
      }
  
      post(route('superadmin.prod.update', { id: prod.id }), {
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

        const trimmedName = data.name.trim();
        const catidx = selectedCat?.id;
        const subidx = selectedSub?.id;

  // Skip check unless all fields are present
        if (!trimmedName || !catidx || !subidx) {
            setProdExists(false);
            return;
        }

        // Skip check if no name or no selectedCat
        if (!data.name.trim() || !selectedCat) {
        setProdExists(false);
        return;
        }

        debounceTimer.current = setTimeout(() => {
        const checkProdEdit = async () => {
            try {
            const response = await customAxios.post('/superadmin/prods/check-prod-edit-superadmin', {
                name: data.name.trim(),
                catid: selectedCat?.id || null,
                subid: selectedSub?.id || null, 
                id: prod.id,
            });
            setProdExists(response.data.exists);
            } catch (error) {
            console.error(error);
            }
        };
        checkProdEdit();
        }, 500); // 500ms debounce delay

        // Cleanup on unmount or next effect run
        return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [data.name, selectedCat, selectedSub, prod.id]);

     const [prodcodeExists, setProdcodeExists] = useState(false);

     const checkProdCodeEdit = async (coder: string) => {
        try {
            const response = await customAxios.post(
            '/superadmin/prods/check-prodcode-edit-superadmin',
            { coder: coder, id: prod.id }
            );
            setProdcodeExists(response.data.exists2);
        } catch (error) {
            console.error("Code check failed", error);
            setProdcodeExists(false);
        }
        };

        const [selectedTags, setSelectedTags] = useState(
            taggs
                .filter((t) => selectedTaggIds.includes(t.id))
                .map((t) => ({ value: t.id, label: t.name }))
            );


/*

    const checkProdEdit = async (name: string) => 
    {
        try {
        const response = await customAxios.post('/superadmin/prods/check-prod-edit-superadmin', {
            name:name.trim(),
            catid: selectedCat?.id,
            subid: selectedSub?.id, 
            id: prod.id,
        });
  
        setProdExists(response.data.exists);
        
        } catch (error) {
        console.error(error);
        }
    };
  */



    const [query, setQuery] = useState('');
    const [catQuery, setCatQuery] = useState('');
    const [subQuery, setSubQuery] = useState('');

    // Filtered categories based on query
    const filteredCats = catQuery === ''
    ? cats
    : cats.filter((cat) =>
        cat.name.toLowerCase().includes(catQuery.toLowerCase())
        );

    const [filteredSubs, setFilteredSubs] = useState<Subcat[]>([]);    
    // Filtered subcategories based on query and selected category
    /*
    const filteredSubs = query === ''                           
        ? subs
        : subs.filter((sub) =>
            sub.name.toLowerCase().includes(query.toLowerCase()) &&
            sub.catid === (selectedCat ? selectedCat.id : null)
        );
        */

        const hasLoaded = useRef(false);

        useEffect(() => {
        if (selectedCat) {
            const matchingSubs = subs.filter(sub => sub.catid === selectedCat.id);
            setFilteredSubs(matchingSubs);

            console.log('hasLoaded.current', hasLoaded.current);

            if (hasLoaded.current) {
            setData('subid', 0);
            setSelectedSub(null);
            } else {
            hasLoaded.current = true; // only sets once
            }
        } else {
            setFilteredSubs([]);
        }
        }, [selectedCat, subs, setData, setSelectedSub]);

        
        const searchedFilteredSubs = subQuery === ''
        ? filteredSubs
        : filteredSubs.filter(sub =>
            sub.name.toLowerCase().includes(subQuery.toLowerCase())
            );
            console.log('subQuery', subQuery);
            console.log('filteredSubs', filteredSubs);


  return (
        <>
        <Head title="Edit Product" />
        <AppLayout>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 w-[92%]"
            encType="multipart/form-data" >

             <div className="flex gap-4">

                <div className="w-1/2">
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
                            onChange={(event) => setCatQuery(event.target.value)}
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
                    {prodExists && <div className="text-red-500 text-sm">SubCategory already exists.</div>}
                    {localErrors.catid && <div className="text-red-500 text-sm">{localErrors.catid}</div>}
                    {errors.catid && <div className="text-red-500">{errors.catid}</div>}
            </div>


             <div className="w-1/2">
                <label className="block mb-1">SubCategory:</label>
                [{selectedSub?.id}]
                    <Combobox
                    value={selectedSub}
                    onChange={(sub) => {
                        setSelectedSub(sub);
                        setData('subid', sub?.id); // <-- Sync selected category with form state
                    }}
                    >
                    <div className="relative">
                        <div className="relative w-full">
                        <Combobox.Input
                            className="w-full border p-2 pr-10"
                            displayValue={(sub) => sub?.name || ""}
                            onChange={(event) => setSubQuery(event.target.value)}
                            placeholder="Search Subcategories..."
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                        </div>

                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                        {searchedFilteredSubs.length === 0 ? (
                            <div className="p-2 text-gray-500">Nothing found.</div>
                        ) : (
                            searchedFilteredSubs.map((sub) => (
                            <Combobox.Option
                                key={sub.id}
                                value={sub}
                                className={({ active }) =>
                                `cursor-pointer select-none p-2 ${
                                    active ? "bg-blue-500 text-white" : "text-gray-900"
                                }`
                                }
                            >
                                {sub.name}
                            </Combobox.Option>
                            ))
                        )}
                        </Combobox.Options>
                    </div>
                    </Combobox>
                    {prodExists && <div className="text-red-500 text-sm">SubCategory already exists.</div>}
                    {localErrors.subid && <div className="text-red-500 text-sm">{localErrors.subid}</div>}
                    {errors.subid && <div className="text-red-500">{errors.subid}</div>}
                </div>
           
            </div>


            <div className="flex gap-4">           
                <div className="w-1/2">
                    <label>Title:</label>
                    <input
                    type="text"
                    value={data.name}
                    onChange={(e) => {
                    setData('name', e.target.value);
                    setLocalErrors((prev) => ({ ...prev, name: '' }));
                    setProdExists(false);
                    }}
                    className="w-full border rounded p-2"
                    />
                {localErrors.name && <div className="text-red-500 text-sm mt-1">{localErrors.name}</div>}
                {!localErrors.name && prodExists && (
                    <div className="text-red-500 text-sm mt-1">Already in use.</div>
                )}
                {!localErrors.name && !prodExists && errors.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                )}
                </div>

                <div className="w-1/2">
                    <label>Coder:</label>
                    <input
                    type="text"
                    value={data.coder}
                    onChange={(e) => {
                        setData('coder', e.target.value);
                        setProdcodeExists(false);
                        setLocalErrors((prev) => ({ ...prev, coder: '' }));
                    }}
                    onBlur={(e) => checkProdCodeEdit(e.target.value)}
                    className="w-full border rounded p-2"
                    />
                {prodcodeExists && <div className="text-red-500 text-sm mt-1">Coder already exists.</div>}
                {localErrors.coder && <div className="text-red-500 text-sm mt-1">{localErrors.coder}</div>}
                {errors.coder && <div className="text-red-500 text-sm">{errors.coder}</div>}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="taggstoadd" className="block mb-1 font-medium text-gray-700">
                    Tags
                </label>
                <Select
                    id="taggstoadd"
                    isMulti
                    options={taggs.map((t) => ({ value: t.id, label: t.name }))}
                    value={selectedTags}
                    onChange={(selectedOptions) => {
                    setSelectedTags(selectedOptions); // updates UI
                    const ids = selectedOptions.map((opt) => opt.value); // only ids
                    setData('taggstoadd', ids); // update form data
                    }}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select tags..."
                    isSearchable
                />
      
                </div>


            <div className="flex gap-4 mt-4">
                <div className="w-1/3">
                  <label>Price</label>
                  <input
                    type="number"
                    value={data.prix}
                    onChange={(e) => setData('prix', e.target.value)}
                    className="w-full border p-2"
                  />
                  {localErrors.prix && <div className="text-red-500 text-sm">{localErrors.prix}</div>}
                  {errors.prix && <div className="text-red-500">{errors.prix}</div>}
                </div>

                <div className="w-1/3">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={data.quan}
                    onChange={(e) => setData('quan', e.target.value)}
                    className="w-full border p-2"
                  />
                  {localErrors.quan && <div className="text-red-500 text-sm">{localErrors.quan}</div>}
                  {errors.quan && <div className="text-red-500">{errors.quan}</div>}
                </div>

                <div className="w-1/3">
                  <label>Order</label>
                  <input
                    type="number"
                    value={data.ordd}
                    onChange={(e) => setData('ordd', e.target.value)}
                    className="w-full border p-2"
                  />
                  {localErrors.ordd && <div className="text-red-500 text-sm">{localErrors.ordd}</div>}
                  {errors.ordd && <div className="text-red-500">{errors.ordd}</div>}
                  </div>
              </div>

              <div className="mb-4"> 
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea
                      name="des"
                      value={data.des}
                      onChange={(e) => setData('des', e.target.value)}
                      className="w-full border p-2"
                      rows={3}
                  />
                  {localErrors.des && <div className="text-red-500 text-sm">{localErrors.des}</div>}
                  {errors.des && <div className="text-red-500">{errors.des}</div>}  
              </div> 

              <div className="mb-4">
                
                  <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                  <Editor
                    apiKey="wtkr004h3tlah7yljg2m1o3rg03scnqq5lg4ph3jjhg7j59t" // You can use this for development
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={data.dess}
                  init={{
                      height: 400,
                      menubar: 'file edit view insert format tools table help',
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                        'emoticons', 'textcolor'
                      ],
                      toolbar:
                        `undo redo | blocks fontfamily fontsize | 
                        bold italic underline forecolor backcolor | 
                        alignleft aligncenter alignright alignjustify | 
                        bullist numlist outdent indent | 
                        link image media | code preview fullscreen`,
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                         directionality: 'ltr', 
                         setup: (editor) => {
                            editor.on('init', () => {
                                editor.getBody().setAttribute('dir', 'ltr');
                            });
                        }
                    }}
                    onEditorChange={(newValue) => setData('dess', newValue) }
                  />
                  {localErrors.dess && <div className="text-red-500 text-sm">{localErrors.dess}</div>}
                  {errors.dess && <div className="text-red-500">{errors.dess}</div>}
                
              </div> 

              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                    <input
                    type="radio"
                    name="vis"
                    value="1"
                    checked={String(data.vis) === '1'}
                    onChange={(e) => setData('vis', e.target.value)}
                    className="mr-2"
                    />
                    <span className="text-sm">Visible</span>

                    <input
                    type="radio"
                    name="vis"
                    value="0"
                    checked={String(data.vis) === '0'}
                    onChange={(e) => setData('vis', e.target.value)}
                    className="ml-4 mr-2"
                    />
                    <span className="text-sm">Hidden</span>

                  {localErrors.vis && <div className="text-red-500 text-sm">{localErrors.vis}</div>}
                  {errors.vis && <div className="text-red-500">{errors.vis}</div>}                        
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
                  {!previewUrl && prod.img2 && (
                    <div className="mt-2">
                      <img src={`/${prod.img2}`} alt="Current" className="w-20 h-20 rounded object-cover shadow" />
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
                    {prod.filer && (
                    <div className="mt-2">
                        <a href={`/${prod.filer}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
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
                    Object.values(localErrors).some((v) => v !== '') || prodExists
                }
                className={` px-4 py-2 text-white ${
                processing || Object.values(localErrors).some((v) => v !== '') || prodExists
                 || prodcodeExists
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

export default EditProd