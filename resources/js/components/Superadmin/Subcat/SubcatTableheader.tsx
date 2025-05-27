import React from 'react';

type Props = {
  filters: {
    sort: string;
    direction: string;
  };
  sortBy: (column: string) => void;
  toggleSelectAll: () => void;
  subs: {
    data: { id: number }[];
  };
  selectedIds: number[];

};

const SubcatTableHeader = ({
  filters,
  sortBy,
  toggleSelectAll,
  subs,
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
                subs.data.length > 0 &&
                subs.data.every((u) => selectedIds.includes(u.id))
                }
          />
        </th>

{['id', 'name', 'catid'].map((column) => (
  <th
    key={column}
    className="p-2 border cursor-pointer"
    onClick={() => sortBy(column)}
  >
    {column === 'catid' ? 'Category' : column.charAt(0).toUpperCase() + column.slice(1)}{' '}
    {filters.sort === column
      ? filters.direction === 'asc'
        ? '↑'
        : '↓'
      : '⇅'}
  </th>
))}

        <th className="p-2 border">By Category</th>
        <th className="p-2 border">Action</th>
      </tr>
    </thead>
  );
};

export default SubcatTableHeader;
