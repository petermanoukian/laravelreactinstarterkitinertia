//component path is Superadmin/Prod/ProdFilter.tsx

import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Select from 'react-select';

type Cat = {
  id: number;
  name: string;
};

type Sub = {
  id: number;
  catid:number
  name: string;
};

type Tagg = {
  id: number;
  name: string;
};

type ProdFilterProps = {
  search: string;
  setSearch: (value: string) => void;
  catid: number;
  setCatidState: (value: number) => void;
  subid: number;
  setSubidState: (value: number) => void;
  cats: Cat[];
  subs: Sub[];
    alltags: Tagg[];
  taggids: number[];
  setTaggidsState: (value: number[]) => void;
};

const ProdFilter: React.FC<ProdFilterProps> = 
({ search, setSearch, catid, setCatidState, cats , subs , setSubidState , subid,
    alltags,taggids,setTaggidsState,

}) => {

  const [query, setQuery] = useState('');
  const [catQuery, setCatQuery] = useState('');
  const [subQuery, setSubQuery] = useState('');

  const filteredCats =
    query === ''
      ? cats
      : cats.filter((cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase())
        );

  const selectedCat = cats.find((cat) => cat.id === catid) || null;

  const filteredSubs = subs
    .filter((sub) => sub.catid === catid)
    .filter((sub) =>
      subQuery === '' ? true : sub.name.toLowerCase().includes(subQuery.toLowerCase())
    );

  const selectedSub = subs.find((sub) => sub.id === subid) || null;
    //console.log('catid ' , catid);
    //console.log('selctedcat ' ,selectedCat);
    //console.log('selectedSub ' ,selectedSub);
    //console.log('subid' , subid);
   const tagOptions = alltags.map((tag) => ({ value: tag.id, label: tag.name }));

  // Selected options for react-select based on taggids
  const selectedTags = tagOptions.filter((tag) => taggids.includes(tag.value));

  // Handler for react-select onChange
  const onTagChange = (selected: any) => {
    // selected can be null or array of options
    if (selected && Array.isArray(selected)) {
      setTaggidsState(selected.map((tag: any) => tag.value));
    } else {
      setTaggidsState([]);
    }
  };
  
    

  return (

    <>
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search By Name"
        className="border px-3 py-2 rounded w-full md:w-64"
      />

      <Combobox value={selectedCat} onChange={(cat: Cat) => setCatidState(cat.id)}>
        <div className="relative w-full md:w-64">
          <Combobox.Input
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => setCatQuery(e.target.value)}
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


       <Combobox value={selectedSub} onChange={(sub: Sub) => setSubidState(sub.id)}>
        <div className="relative w-full md:w-64">
          <Combobox.Input
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => setSubQuery(e.target.value)}
            displayValue={(sub: Sub) => (sub ? sub.name : '')}
            placeholder="Select subcategory"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredSubs.length > 0 && (
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
                All SubCategories
              </Combobox.Option>
              {filteredSubs.map((sub) => (
                <Combobox.Option
                  key={sub.id}
                  value={sub}
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
                        {sub.name}
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
    </div>
      <div className="w-full md:w-200">
          <Select
            options={tagOptions}
            value={selectedTags}
            onChange={onTagChange}
            isMulti
            placeholder="Select tags"
            classNamePrefix="react-select"
            closeMenuOnSelect={false}
          />
        </div>
   

                  
               




    
    </>
  );
};

export default ProdFilter;