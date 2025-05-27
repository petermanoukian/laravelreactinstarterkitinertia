//resources/js/components/Superadmin/Cat/CatFilter.tsx

import React from 'react';

type CatFilterProps = {
  search: string;
  setSearch: (value: string) => void;
};


const CatFilter: React.FC<CatFilterProps> = ({ search, setSearch }) => {
  return (
    <div className="mb-4 flex gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title"
        className="border px-3 py-2 rounded w-64"
      />

    </div>
  );
};

export default CatFilter;