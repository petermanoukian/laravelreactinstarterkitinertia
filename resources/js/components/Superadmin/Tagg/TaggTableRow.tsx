import React from 'react';
import { Link } from '@inertiajs/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import DeleteUserButton from '@/components/Superadmin/User/DeleteUserButton'
import { Eye, Pencil , Plus} from 'lucide-react'




type Tagg = {
  id: number;
  name: string;
  /*subcats_count: number; */
};

type Props = {
  tagg: Tagg;
  selectedIds: number[];
  toggleSelect: (id: number) => void;
 
  handleDelete: (id: number) => void;
};

const TaggTableRow = ({
  tagg,
  selectedIds,
  toggleSelect,

  handleDelete,
}: Props) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border">
      
          <input
            type="checkbox"
            checked={selectedIds.includes(tagg.id)}
            onChange={() => toggleSelect(tagg.id)}
          />
        
      </td>

      <td className="p-2 border">{tagg.id}</td>
      <td className="p-2 border">{tagg.name}</td>
      <td className="p-2 border align-middle">
        <div className="flex items-center space-x-2">
    
          <Link
            href={route('superadmin.tagg.edit', tagg.id)}
            className="text-blue-600 hover:underline" >
           <Pencil className="w-[20px] h-[20px]"/>
          </Link>
       
          <DeleteUserButton onDelete={() => handleDelete(tagg.id)} />

          <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link href={route('superadmin.subs.index', tagg.id)} className="text-blue-600 hover:text-blue-800">
                    <Eye size={20} />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-black text-white text-sm rounded px-2 py-1 shadow-lg" sideOffset={5}>
                  View Related
                 { /* {tagg.subcats_count} */ }
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Root>

            </Tooltip.Provider>


            <Link href={route('superadmin.prod.create', { taggid: tagg.id })}> &rsaquo; Add Product</Link>
            <Link href={route('superadmin.prods.index', { taggid: tagg.id })}>
            &rsaquo; View Products</Link>

        </div>
      </td>
    </tr>
  );
};

export default TaggTableRow