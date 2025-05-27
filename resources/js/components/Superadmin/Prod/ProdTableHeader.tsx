import React from 'react';

type Props = {
  filters: {
    sort: string;
    direction: string;
  };
  sortBy: (column: string) => void;
  toggleSelectAll: () => void;
  prods: {
    data: { id: number }[];
  };
  selectedIds: number[];

};

const ProdTableHeader = ({
  filters,
  sortBy,
  toggleSelectAll,
  prods,
  selectedIds,

}: Props) => {
  return (
    <thead className="bg-gray-100 font-bold">
      <tr>
        <th className="p-2 border">
          <input
            type="checkbox"
            onChange={toggleSelectAll}
                checked={
                prods.data.length > 0 &&
                prods.data.every((u) => selectedIds.includes(u.id))
                }
          />
        </th>

            {['id', 'name', 'catid' , 'subid'].map((column) => (
            <th
            key={column}
            className="p-2 border cursor-pointer"
            onClick={() => sortBy(column)}
            >
            {column === 'catid'
                ? 'Category'
                : column === 'subid'
                ? 'SubCategory'
                : column.charAt(0).toUpperCase() + column.slice(1)
            }{' '}
            {filters.sort === column
                ? filters.direction === 'asc'
                ? '↑'
                : '↓'
                : '⇅'}
            </th>
            ))}
        <th className="p-2 border">Tags</th>
        <th className="p-2 border">Image</th>
        <th className="p-2 border">Action</th>
      </tr>
    </thead>
  );
};

export default ProdTableHeader;
