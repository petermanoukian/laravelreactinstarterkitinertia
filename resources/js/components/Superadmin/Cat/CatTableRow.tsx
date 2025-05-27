import React from 'react';
import { Link } from '@inertiajs/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import DeleteUserButton from '@/components/Superadmin/User/DeleteUserButton'
import { Eye, Pencil , Plus} from 'lucide-react'




type Cat = {
  id: number;
  name: string;
  subcats_count: number;
};

type Props = {
  cat: Cat;
  selectedIds: number[];
  toggleSelect: (id: number) => void;
 
  handleDelete: (id: number) => void;
};

const CatTableRow = ({
  cat,
  selectedIds,
  toggleSelect,

  handleDelete,
}: Props) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border">
      
          <input
            type="checkbox"
            checked={selectedIds.includes(cat.id)}
            onChange={() => toggleSelect(cat.id)}
          />
        
      </td>

      <td className="p-2 border">{cat.id}</td>
      <td className="p-2 border">{cat.name}</td>
      <td className="p-2 border align-middle">
        <div className="flex items-center space-x-2">
    
          <Link
            href={route('superadmin.cat.edit', cat.id)}
            className="text-blue-600 hover:underline" >
           <Pencil className="w-[20px] h-[20px]"/>
          </Link>
       
          <DeleteUserButton onDelete={() => handleDelete(cat.id)} />

          <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link href={route('superadmin.subs.index', cat.id)} className="text-blue-600 hover:text-blue-800">
                    <Eye size={20} />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-black text-white text-sm rounded px-2 py-1 shadow-lg" sideOffset={5}>
                  View Subcategories {cat.subcats_count}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link href={route('superadmin.sub.create', cat.id)} className="text-green-600 hover:text-green-800">
                    <Plus size={20} />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-black text-white text-sm rounded px-2 py-1 shadow-lg" sideOffset={5}>
                  Add Subcategory
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Root>



            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link href={route('superadmin.prods.index', cat.id)} className="text-blue-600 hover:text-blue-800">
                    <Eye size={20} />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-black text-white text-sm rounded px-2 py-1 shadow-lg" sideOffset={5}>
                  View Products {cat.catprods_count}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link href={route('superadmin.prod.create', cat.id)} 
                  className="text-green-600 hover:text-green-800">
                    <Plus size={20} />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-black text-white text-sm rounded px-2 py-1 shadow-lg" sideOffset={5}>
                  Add Product
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Root>





            </Tooltip.Provider>

        </div>
      </td>
    </tr>
  );
};

export default CatTableRow