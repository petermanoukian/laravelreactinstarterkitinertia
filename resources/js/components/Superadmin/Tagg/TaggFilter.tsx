//resources/js/components/Superadmin/Tagg/TaggFilter.tsx

import React from 'react';

type TaggFilterProps = {
  search: string;
  setSearch: (value: string) => void;
};


const TaggFilter: React.FC<TaggFilterProps> = ({ search, setSearch }) => {
  return (
    <div className="mb-4 flex gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name "
        className="border px-3 py-2 rounded w-64"
      />

    </div>
  );
};

export default TaggFilter;