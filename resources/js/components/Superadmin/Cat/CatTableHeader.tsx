import React from 'react';

type Props = {
  filters: {
    sort: string;
    direction: string;
  };
  sortBy: (column: string) => void;
  toggleSelectAll: () => void;
  cats: {
    data: { id: number }[];
  };
  selectedIds: number[];

};

const CatTableHeader = ({
  filters,
  sortBy,
  toggleSelectAll,
  cats,
  selectedIds,

}: Props) => {
  return (
    <thead className="bg-gray-100 font-bold">
      <tr>
        <th className="p-2 border">
          <input
            type="checkbox"
            onChange={toggleSelectAll}
            checked={cats.data

              .every((u) => selectedIds.includes(u.id))}
          />
        </th>

        {['id', 'name'].map((column) => (
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

        <th className="p-2 border">Action</th>
      </tr>
    </thead>
  );
};

export default CatTableHeader;
