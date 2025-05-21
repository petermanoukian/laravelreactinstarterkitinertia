import React from 'react';

type Props = {
  filters: {
    sort: string;
    direction: string;
  };
  sortBy: (column: string) => void;
  toggleSelectAll: () => void;
  users: {
    data: { id: number }[];
  };
  selectedIds: number[];
  loggedInUser?: {
    id: number;
  };
};

const UserTableHeader = ({
  filters,
  sortBy,
  toggleSelectAll,
  users,
  selectedIds,
  loggedInUser,
}: Props) => {
  return (
    <thead className="bg-gray-100 font-bold">
      <tr>
        <th className="p-2 border">
          <input
            type="checkbox"
            onChange={toggleSelectAll}
            checked={users.data
              .filter((u) => u.id !== loggedInUser?.id)
              .every((u) => selectedIds.includes(u.id))}
          />
        </th>

        {['id', 'name', 'email', 'role'].map((column) => (
          <th
            key={column}
            className="p-2 border cursor-pointer"
            onClick={() => sortBy(column)}
          >
            {column.charAt(0).toUpperCase() + column.slice(1)}{' '}
            {filters.sort === column
              ? filters.direction === 'asc'
                ? '↑'
                : '↓'
              : '⇅'}
          </th>
        ))}

        <th className="p-2 border">Image</th>
        <th className="p-2 border">File</th>
        <th className="p-2 border">Action</th>
      </tr>
    </thead>
  );
};

export default UserTableHeader;
