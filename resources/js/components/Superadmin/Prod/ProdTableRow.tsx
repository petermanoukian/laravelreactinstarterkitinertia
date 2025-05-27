import React from 'react';
import { Link } from '@inertiajs/react';

import DeleteUserButton from '@/components/Superadmin/User/DeleteUserButton'
import { Eye, Pencil } from 'lucide-react'




    type Subcat = {
        id: number;
        catid: number;
        name: string;
        cat:Cat;
    }

    type Cat = {
    id: number;
    name: string;
    };


    type Prod = {
        id: number;
        catid: number;
        name: string;
        cat:Cat;
        img?: string;
        img2?: string;
        sub:Subcat;
    }

    type Props = {
    prod: Prod;
    selectedIds: number[];
    toggleSelect: (id: number) => void;
    
    handleDelete: (id: number) => void;
    };

    const ProdTableRow = ({
    prod,
    selectedIds,
    toggleSelect,
    handleDelete,
    }: Props) => {
    return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border">
      
          <input
            type="checkbox"
            checked={selectedIds.includes(prod.id)}
            onChange={() => toggleSelect(prod.id)}
          />
        
      </td>

      <td className="p-2 border">{prod.id}</td>
      <td className="p-2 border">{prod.name}</td>
      <td className="p-2 border">{prod.cat?.name}</td>
      <td className="p-2 border">{prod.sub?.name}</td>
      <td className="p-2 border">
          {prod.taggs?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {prod.taggs.map((tagg: Tagg) => (
                <span
                  key={tagg.id}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {tagg.name}
                </span>
              ))}
            </div>
          )}


      </td>
      <td className="p-2 border">
        {prod.img2 ? (
          <a href={`/${prod.img}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`/${prod.img2}`}
              alt="User"
              className="w-20 h-20 object-cover rounded"
            />
          </a>
        ) : prod.img ? (
          <a href={`/${prod.img}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`/${prod.img}`}
              alt="Fallback"
              className="w-20 h-20 object-cover rounded"
            />
          </a>
        ) : (
          <img
            src="/images/nopic.jpg"
            alt="No Pic"
            className="w-20 h-20 object-cover rounded"
          />
        )}
      </td>



      <td className="p-2 border align-middle">
        <div className="flex items-center space-x-2">
    
          <Link
            href={route('superadmin.prod.edit', prod.id)}
            className="text-blue-600 hover:underline"
          >
           <Pencil className="w-[20px] h-[20px]"/>
          </Link>
       
          <DeleteUserButton onDelete={() => handleDelete(prod.id)} />


       
        </div>
      </td>
    </tr>
  );
};

export default ProdTableRow