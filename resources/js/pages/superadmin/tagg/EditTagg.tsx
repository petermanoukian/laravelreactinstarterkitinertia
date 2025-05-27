import React, { useEffect , useState} from 'react';
import {  Head,useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { route } from '@/ziggy';
import customAxios from '@/lib/axios';

interface Tagg {
  id: number;
  name: string;

}

interface Props {
  tagg: Tagg;
}



const EditTagg: React.FC<Props> = ({ tagg }) => {

    const { data, setData, post, put, processing, errors } = useForm({
    id: tagg.id,
    name: tagg.name || '',
 
  });

  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setData({
      name: tagg.name || '',

    });
  }, [tagg, setData]);

  const [taggExists, setTaggExists] = useState(false);
  
  const validate = () => {
      const errors: { [key: string]: string } = {};
  
      if (!data.name.trim()) 
      {
        errors.name = 'Name is required.';
      }
      setLocalErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return; // stop submit if client-side validation fails
    }

    post(route('superadmin.tagg.update', { id: tagg.id }), {
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
  
  const checkTaggEdit = async (name: string) => 
  {
      try {
      const response = await customAxios.post('/superadmin/taggs/check-tagg-edit-superadmin', {
          name:name,
          id: tagg.id,
      });

      setTaggExists(response.data.exists);
      
      } catch (error) {
      console.error(error);
      }
  };



  return (
 
  <>
    <Head title="Edit Tag" />
    <AppLayout>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto"
          encType="multipart/form-data" >
        <div>
            <label>Title:</label>
            <input
            type="text"
            value={data.name}
              onChange={(e) => {
              setData('name', e.target.value);
              setLocalErrors((prev) => ({ ...prev, name: '' }));
              setTaggExists(false);
            }}

            onBlur={() => checkTaggEdit(data.name)}
            className="w-full border rounded p-2"
            />

          {localErrors.name && <div className="text-red-500 text-sm mt-1">{localErrors.name}</div>}
          {!localErrors.name && taggExists && (
            <div className="text-red-500 text-sm mt-1">Already in use.</div>
          )}
          {!localErrors.name && !taggExists && errors.name && (
            <div className="text-red-500 text-sm">{errors.name}</div>
          )}
        </div>

        {/* Submit */}

          <button
            type="submit"
            disabled={
                Object.values(localErrors).some((v) => v !== '') || taggExists
            }
            className={` px-4 py-2 text-white ${
              processing || Object.values(localErrors).some((v) => v !== '') || taggExists
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

export default EditTagg