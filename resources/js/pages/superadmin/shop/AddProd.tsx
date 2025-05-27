import { Head, useForm , usePage  } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState , useRef } from 'react';
import axios from '@/lib/axios';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import SubcatSelector from '@/components/Superadmin/Subcat/SubcatSelector';
import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select';

type AddProdProps = {
  cats: { id: number; name: string }[];
  subs: { id: number; name: string }[];
  catid?: number | string;
  subid?: number | string;
};

const AddProd: React.FC<AddSubProps> = ({ cats, catid , subs, subid , taggs}) => {

  const initialCatid = catid ? String(catid) : '';
  const initialSubid = subid ? String(subid) : '';
  const editorRef = useRef<any>(null);

  const { url } = usePage()
  const queryx = new URLSearchParams(url.split('?')[1])
  const taggidFromQuery = queryx.get('taggid')


  const { data, setData, post, processing, errors, reset } = useForm({

      catid: initialCatid,
      subid: initialSubid,
      name: '', 
      coder: '',
      ordd: 1,
      vis: '1', 
      quan: 1, 
      prix: '',
      des: '',
      dess: '',
      img: null,     // Optional image file
      filer: null,
      //taggstoadd: [],
      taggstoadd: taggidFromQuery ? [parseInt(taggidFromQuery)] : []

  });

  
  
  const [prodExists, setProdExists] = useState(false);
  const [prodcodeExists, setProdcodeExists] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   
  const [localErrors, setLocalErrors] = useState<{
      name?: string;
      coder?: string;
      catid?: string;
      subid?: string;
      img?: string;
      filer?: string;
      ordd?: string;
      vis?: string;
      quan?: string;
      prix?: string;
      des?: string;
      dess?: string;

  }>({});


  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Submitting data:", data);
      const newErrors: typeof localErrors = {};

      // Basic text fields
      if (!data.name.trim()) {
          newErrors.name = 'SubCategoy Name is required.';
      }
      if (!data.catid.trim()) {
          newErrors.catid = 'Categoy is required.';
      }
      if (!data.subid.trim()) {
          newErrors.subid = 'SubCategoy is required.';
      }
      if (!data.coder.trim()) {
          newErrors.coder = 'Coder is required.';
      }

      // PRIX: can be null or number
      if (data.prix !== null && data.prix !== '' && isNaN(Number(data.prix))) {
        newErrors.prix = 'Prix must be a number or empty.';
      }

      const rawOrdd = data.ordd;
      if (rawOrdd == null || rawOrdd === undefined || rawOrdd === '') {
        data.ordd = 0;
      } else if (isNaN(Number(data.ordd))) {
        newErrors.ordd = 'Order must be a number.';
      }

      // QUAN: default to 1 if missing
      if (data.quan === null || data.quan === undefined || data.quan === '') {
        data.quan = 1;
      } else if (isNaN(Number(data.quan))) {
        newErrors.quan = 'Quantity must be a number.';
      }

      // VIS: must be 0 or 1 (number check)
      if (data.vis !== '0' && data.vis !== '1') {
        newErrors.vis = 'Visibility must be 0 or 1.';
      }

      if (data.img) {
            const allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedImgTypes.includes(data.img.type)) {
                newErrors.img = 'Invalid image format.';
            } else if (data.img.size > 9520 * 1024) {
                newErrors.img = 'Image must be less than 9.3 MB.';
            }
      }

      // Validate document/file upload
      if (data.filer) {
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
          if (!allowedFileTypes.includes(data.filer.type)) {
              newErrors.filer = 'Invalid file format.';
          } else if (data.filer.size > 9520 * 1024) {
              newErrors.filer = 'File must be less than 9.3 MB.';
          }
      }
      setLocalErrors(newErrors);
      console.log("Local errors:", newErrors);
      if (Object.keys(newErrors).length > 0) 
      {
          console.log("Validation errors found:", newErrors);
        return; // Stop submission
      }

      if (!prodExists) 
      {
          console.log(data.vis);
        post('/superadmin/prod/store');
      }  

  };

  useEffect(() => {
    if (data.catid.trim()) {
      setLocalErrors((prev) => ({ ...prev, catid: '' }));
    }
  }, [data.catid]);

  useEffect(() => {
    if (data.subid.trim()) {
      setLocalErrors((prev) => ({ ...prev, subid: '' }));
    }
  }, [data.subid]);

  useEffect(() => {
    if (data.name.trim()) {
      setLocalErrors((prev) => ({ ...prev, name: '' }));
    }
  }, [data.name]);

  useEffect(() => {
    if (data.coder.trim()) {
      setLocalErrors((prev) => ({ ...prev, coder: '' }));
    }
  }, [data.coder]);



  const checkProd = async (name: string) => {
      try {
        const response = await axios.post(route('superadmin.prods.checkProd'), {
          name,
          catid: data.catid,
          subid: data.subid,
        });
        setProdExists(response.data.exists);
      } catch (error) {
        console.error("Check failed", error);
        setProdExists(false);
      }
  };

  const checkProdCode = async (coder: string) => {
    try {
      const response = await axios.post(route('superadmin.prods.checkProdCode'), {
        coder,
      });
      setProdcodeExists(response.data.exists2);
    } catch (error) {
      console.error("Code check failed", error);
      setProdcodeExists(false);
    }
  };


  useEffect(() => {
      if (data.name && data.catid  && data.subid) {
        checkProd(data.name);
      }
  }, [data.catid, data.subid, data.name]);

  const [selectedCat, setSelectedCat] = useState(
      cats.find((cat) => cat.id === Number(data.catid)) || null
  )
  const [selectedSub, setSelectedSub] = useState(null);
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

    useEffect(() => {
    setSelectedSub(null);  // Clear subcategory when category changes
  }, [selectedCat]);

  const [filteredSubs, setFilteredSubs] = useState([]);



    useEffect(() => {
      if (!selectedCat) {
        setFilteredSubs([]);  
        console.log("selectedCat is null");
        return;
    }

    const filtered = subs
        .filter((sub) => sub.catid === selectedCat.id)
        .filter((sub) => sub.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredSubs(filtered);
    }, [subs, selectedCat, query]);



  // Reset selectedSub when selectedCat changes

  const handleSubSelect = (sub: SubcatType | null) => {
    setSelectedSub(sub); // ✅ update local selected
    // Delay or debounce setData if needed
    if (sub?.id) {
      setData("subid", sub.id.toString());
    } else {
      setData("subid", "");
    }
  };


  useEffect(() => {
    // Only set selectedSub if it's not already set
    if (!selectedSub && data.subid) {
      const foundSub = subs.find((sub) => String(sub.id) === String(data.subid)) || null;
      setSelectedSub(foundSub);
    }
  }, []); // 👈 only run once on mount

    const taggOptions = taggs.map((tagg: any) => ({
      value: tagg.id,
      label: tagg.name, // or whatever field holds the name
    }));
 


  return (
     <>
    <Head title="Add Product" />
    <AppLayout>
        <div className="p-12"> 
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>
        <p>
            <Link
              href={
                initialCatid && initialSubid
                  ? `/superadmin/prods/view?catid=${initialCatid}&subid=${initialSubid}`
                  : initialCatid
                  ? `/superadmin/prods/view?catid=${initialCatid}`
                  : `/superadmin/prods/view`
              }
              prefetch
              className="bg-blue-600 text-blue-700 rounded
                        hover:bg-blue-200 hover:text-blue-500
                        py-3 mb-3 px-4 text-white hover:text-blue-500"
            >
              &raquo; View Products
            </Link>

        </p>


        <form onSubmit={handleSubmit} className="mt-5 space-y-4 w-[92%]"
        autoComplete="off">

            <div className="flex gap-4">
              <div className="w-1/2">
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

                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto 
                  rounded-md border bg-white shadow-lg">

                  <Combobox.Option
                      key="all"
                      value='' 
                      className={({ active }) =>
                      `cursor-pointer select-none p-2 font-semibold italic ${
                          active ? "bg-blue-500 text-white" : "text-gray-700"
                      }`
                      }
                  >
                      All Categories
                  </Combobox.Option>


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
                {prodExists && <div className="text-red-500 text-sm">
                  Category already exists for this item.</div>}
                {localErrors.catid && <div className="text-red-500 text-sm">{localErrors.catid}</div>}
                {errors.catid && <div className="text-red-500">{errors.catid}</div>}
            </div>

             
          <div className="w-1/2">
              <label className="block mb-1">SubCategory:  </label>
              <SubcatSelector
                allSubs={subs}                         
                selectedSub={selectedSub}               
                selectedCat={selectedCat}             
                setSelectedSub={setSelectedSub}  
                handleSubSelect={handleSubSelect}     
              />
              {prodExists && (
                <div className="text-red-500 text-sm">SubCategory already exists for this item.</div>
              )}
              {localErrors.subid && <div className="text-red-500 text-sm">{localErrors.subid}</div>}
              {errors.subid && <div className="text-red-500">{errors.subid}</div>}
            </div>
         
        </div>

          {selectedCat && selectedSub && (
            <>
              <div className="flex gap-4">
                  <div className="w-1/2">
                    <label>Name</label>
                    <input
                        type="text"
                        value={data.name}
                        
                        onChange={(e) => {
                            setData('name', e.target.value);
                            setProdExists(false);
                            setLocalErrors(prev => ({ ...prev, name: '' }));
                        }}
                        //onBlur={(e) => checkSub(e.target.value)}
                        className="w-full border p-2"
                    />
                    {prodExists && (
                        <div className="text-red-500 text-sm mt-1">
                            Already found a product with this name in the selected 
                            category and subcategory.
                        </div>
                    )}

                    {localErrors.name && <div className="text-red-500 text-sm">{localErrors.name}</div>}
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                </div>


                <div className="w-1/2">
                  <label>Code</label>
                  <input
                    type="text"
                    value={data.coder}
                    onChange={(e) => 
                      {
                        setData('coder', e.target.value)
                        setProdcodeExists(false);
                      }
                    }
                    onBlur={(e) => checkProdCode(e.target.value)}
                    className="w-full border p-2"
                  />
                  {prodcodeExists && (
                    <div className="text-red-500 text-sm mt-1">
                      Product code already exists.
                    </div>
                  )}
                   {localErrors.coder && <div className="text-red-500 text-sm">{localErrors.coder}</div>}
                  {errors.coder && <div className="text-red-500">{errors.coder}</div>}
                </div>
              </div>

            <div className="flex gap-4">
             <label>Tags</label>   
                  
            <Select
              isMulti
              name="taggstoadd"
              options={taggs.map(tag => ({
                value: tag.id,
                label: tag.name,
              }))}
              className="basic-multi-select w-full"
              classNamePrefix="select"
              placeholder="Select tags..."
              onChange={(selected) => {
                // Set taggstoadd to an array of tag IDs
                setData('taggstoadd', selected.map(item => item.value));
              }}
              value={taggs
                .filter(tag => data.taggstoadd.includes(tag.id))
                .map(tag => ({ value: tag.id, label: tag.name }))
              }
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
                
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description</label>
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

              <div className="mb-4" style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}>
                
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description</label>
                  <Editor
                    apiKey="wtkr004h3tlah7yljg2m1o3rg03scnqq5lg4ph3jjhg7j59t" 
                    onInit={(evt, editor) => {
                    editorRef.current = editor;
                  }}
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
                    toolbar: `
                      undo redo | blocks fontfamily fontsize | 
                      bold italic underline forecolor backcolor | 
                      alignleft aligncenter alignright alignjustify | 
                      bullist numlist outdent indent | 
                      link image media | code preview fullscreen`,
                    content_style: `
                      body {
                        font-family: Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        direction: ltr !important;
                        unicode-bidi: normal !important;
                        text-align: left !important;
                      }`,
                    directionality: 'ltr',
                    setup: (editor) => {
                      editor.on('init', () => {
                        const body = editor.getBody();
                        body.setAttribute('dir', 'ltr');
                        body.style.direction = 'ltr';
                        body.style.textAlign = 'left';
                        body.style.unicodeBidi = 'normal';
                      });
                    }
                  }}
                  onEditorChange={(newValue) => {
                    console.log('Content was updated:', newValue);
                    const cleaned = newValue
                      .replace(/dir="rtl"/g, '')
                      .replace(/style="[^"]*direction:\s*rtl;?[^"]*"/gi, '')
                      .replace(/style="[^"]*unicode-bidi:\s*bidi-override;?[^"]*"/gi, '');
                      console.log('Content was cleaned:', cleaned);
                    setData('dess', cleaned);
                  }}


                  />
                  {localErrors.dess && <div className="text-red-500 text-sm">{localErrors.dess}</div>}
                  {errors.dess && <div className="text-red-500">{errors.dess}</div>}
                
              </div> 

              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                 <input type="radio"
                  name="vis"   value="1" 
                  checked={data.vis == '1'}
                  onChange={(e) => setData('vis', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Visible</span>
                <input type="radio"
                  name="vis" value="0"          
                  checked={data.vis == '0'}                  
                  onChange={(e) => setData('vis', e.target.value)}
                  className="ml-4 mr-2" 
                />
                <span className="text-sm">Hidden</span>

                  {localErrors.vis && <div className="text-red-500 text-sm">{localErrors.vis}</div>}
                  {errors.vis && <div className="text-red-500">{errors.vis}</div>}                        
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

                          // ✅ Clear only the image error
                          setLocalErrors(prev => ({ ...prev, img: '' }));

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

                  {data.img && typeof data.img !== 'string' && (
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

                  {data.filer && (
                      <div className="mt-2 text-sm text-gray-600">
                          Selected: {typeof data.filer === 'string' ? data.filer : data.filer.name}
                      </div>
                  )}
                  {localErrors.filer && <div className="text-red-500 text-sm">{localErrors.filer}</div>}
                  {errors.filer && <div className="text-red-500 text-sm mt-1">{errors.filer}</div>}
              </div>




          </>



    )}
            <button
                type="submit"
                disabled={processing || Object.values(localErrors).some((v) => v !== '')
                    || prodExists}
                className={` px-4 py-2 text-white ${
                    processing || Object.values(localErrors).some((v) => v !== '') || prodExists
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

export default AddProd