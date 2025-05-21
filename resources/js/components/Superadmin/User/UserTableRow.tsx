import React from 'react';
import { Link } from '@inertiajs/react';

import DeleteUserButton from '@/components/Superadmin/User/DeleteUserButton'
import { Eye, Pencil } from 'lucide-react'


type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  img?: string;
  img2?: string;
  filer?: string;
};

type Props = {
  userx: User;
  selectedIds: number[];
  toggleSelect: (id: number) => void;
  loggedInUser?: {
    id: number;
    role: string;
  };
  handleDelete: (id: number) => void;
};

const UserTableRow = ({
  userx,
  selectedIds,
  toggleSelect,
  loggedInUser,
  handleDelete,
}: Props) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border">
        {userx.id !== loggedInUser?.id && (
          <input
            type="checkbox"
            checked={selectedIds.includes(userx.id)}
            onChange={() => toggleSelect(userx.id)}
          />
        )}
      </td>

      <td className="p-2 border">{userx.id}</td>
      <td className="p-2 border">{userx.name}</td>
      <td className="p-2 border">{userx.email}</td>
      <td className="p-2 border">{userx.role}</td>

      <td className="p-2 border">
        {userx.img2 ? (
          <a href={`/${userx.img}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`/${userx.img2}`}
              alt="User"
              className="w-20 h-20 object-cover rounded"
            />
          </a>
        ) : userx.img ? (
          <a href={`/${userx.img}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`/${userx.img}`}
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

      <td className="p-2 border">
        {userx.filer ? (
          <a
            href={`/${userx.filer}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            <Eye className="w-[20px] h-[20px]"/>
          </a>
        ) : (
          '—'
        )}
      </td>

      <td className="p-2 border align-middle">
        <div className="flex items-center space-x-2">
        {(loggedInUser?.role === 'superadmin' || loggedInUser?.id === userx.id) && (
          <Link
            href={route('superadmin.user.edit', userx.id)}
            className="text-blue-600 hover:underline"
          >
           <Pencil className="w-[20px] h-[20px]"/>
          </Link>
        )}
        {loggedInUser?.role === 'superadmin' && loggedInUser?.id !== userx.id && (
    
             <DeleteUserButton onDelete={() => handleDelete(userx.id)} />

       
        )} 
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
