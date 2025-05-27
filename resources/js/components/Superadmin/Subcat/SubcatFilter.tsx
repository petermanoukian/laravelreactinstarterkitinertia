
// resources/js/components/Superadmin/Cat/SubcatFilter.tsx

import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

type Cat = {
  id: number;
  name: string;
};

type SubcatFilterProps = {
  search: string;
  setSearch: (value: string) => void;
  catid: number;
  setCatidState: (value: number) => void;
  cats: Cat[];
};

const SubcatFilter: React.FC<SubcatFilterProps> = ({ search, setSearch, catid, setCatidState, cats }) => {

  const [query, setQuery] = useState('');

  const filteredCats =
    query === ''
      ? cats
      : cats.filter((cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase())
        );

  const selectedCat = cats.find((cat) => cat.id === catid) || null;



  return (

    <>
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search subcategory"
        className="border px-3 py-2 rounded w-full md:w-64"
      />

    <Combobox value={selectedCat} onChange={(cat: Cat) => setCatidState(cat.id)}>
        <div className="relative w-full md:w-64">
          <Combobox.Input
            className="border px-3 py-2 rounded w-full"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(cat: Cat) => (cat ? cat.name : '')}
            placeholder="Select category"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredCats.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded 
            bg-white border py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 
            focus:outline-none sm:text-sm">

              <Combobox.Option
                key="all"
                value='' // or use '' if needed
                className={({ active }) =>
                  `cursor-pointer select-none p-2 font-semibold italic ${
                    active ? "bg-blue-500 text-white" : "text-gray-700"
                  }`
                }
              >
                All Categories
              </Combobox.Option>
              {filteredCats.map((cat) => (
                <Combobox.Option
                  key={cat.id}
                  value={cat}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-4 py-2 ${
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {cat.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>



      {/* Category Dropdown */}
      {/*}
      <select
        value={catid}
        onChange={(e) => setCatid(Number(e.target.value))}
        className="border px-3 py-2 rounded w-full md:w-64"
      >
        <option value="">All Categories</option>
        {cats.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      */}
    </div>
    </>
  );
};

export default SubcatFilter;
