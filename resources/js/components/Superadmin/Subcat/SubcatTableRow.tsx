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

    type Props = {
    subcat: Subcat;
    selectedIds: number[];
    toggleSelect: (id: number) => void;
    
    handleDelete: (id: number) => void;
    };

    const SubcatTableRow = ({
    subcat,
    selectedIds,
    toggleSelect,
    handleDelete,
    }: Props) => {
    return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border">
      
          <input
            type="checkbox"
            checked={selectedIds.includes(subcat.id)}
            onChange={() => toggleSelect(subcat.id)}
          />
        
      </td>

      <td className="p-2 border">{subcat.id}</td>
      <td className="p-2 border">{subcat.name}</td>
      <td className="p-2 border">{subcat.cat.name}</td>

      <td className="p-2 border">
        <div className="flex gap-2">
        

          {/* Display subcategory count */}
          <span className="text-sm text-gray-500">
            ({subcat.cat.subcats_count} total)
          </span>

          {/* Add Subcategory Button */}
          <Link
            href={route('superadmin.sub.create', subcat.cat.id)}
            className="text-green-600 hover:underline text-sm"
            title="Add subcategory to this category"
          >
            + Add
          </Link>
        </div>
      </td>



      <td className="p-2 border align-middle">
        <div className="flex items-center space-x-2">
    
          <Link
            href={route('superadmin.sub.edit', subcat.id)}
            className="text-blue-600 hover:underline"
          >
           <Pencil className="w-[20px] h-[20px]"/>
          </Link>
       
          <DeleteUserButton onDelete={() => handleDelete(subcat.id)} />

          <Link
            href={route('superadmin.prod.create', [subcat.catid, subcat.id])}
            className="text-green-600 hover:underline"
          >
            Add Products
          </Link>

          {/* ✅ View Products Link */}
          <Link
            href={route('superadmin.prods.index', [subcat.catid, subcat.id])}
            className="text-indigo-600 hover:underline"
          >
            View products
          </Link>
       
        </div>
      </td>
    </tr>
  );
};

export default SubcatTableRow