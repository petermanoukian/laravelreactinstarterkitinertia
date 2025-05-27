// PAGE is found on resources/js/pages/superadmin/shop/AddSub.tsx
//component is found on resources/js/components/superadmin/shop/SubcatSelector.tsx
import axios from '@/lib/axios';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

type Subcat = {
  id: number;
  name: string;
  catid: number;
};

interface Props {
  allSubs: Subcat[];
  selectedSub: Subcat | null;
  selectedCat: Cat | null;                // <-- add this prop for filtering by category
  setSelectedSub: (sub: Subcat | null) => void;
   handleSubSelect: (sub: SubcatType | null) => void;
}

export default function SubcatSelector({
  allSubs,
  selectedSub,
  selectedCat,
  setSelectedSub,
  handleSubSelect
}: Props) {
  const [query, setQuery] = useState('');
  const [filteredSubs, setFilteredSubs] = useState<Subcat[]>([]);

useEffect(() => {
  if (!selectedCat) {
    setFilteredSubs([]); // No category selected → show nothing
    return;
  }

  /*
  const filtered = allSubs
    .filter(sub => sub.catid === selectedCat.id)
    .filter(sub => sub.name.toLowerCase().includes(query.toLowerCase()));

  setFilteredSubs(filtered);
*/

 axios.get(`/superadmin/subcatsbycat/${selectedCat.id}`)
    .then((res) => {
      const filtered = res.data.subs.filter((sub: SubcatType) =>
        sub.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSubs(filtered);
    })
    .catch((err) => console.error(err));



}, [query, allSubs, selectedCat]);

  return (
    <Combobox
      value={selectedSub}
      onChange={(sub) => {
        
        setSelectedSub(sub); 
        handleSubSelect(sub);
        // update selectedSub in parent
      }}
    >
      <div className="relative">
        <Combobox.Input
          className="w-full border p-2 pr-10"
          displayValue={(sub: Subcat) => sub?.name || ''}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search subcategories..."
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
          <Combobox.Option
            key="all"
            value={null}
            className={({ active }) =>
              `cursor-pointer select-none p-2 font-semibold italic ${
                active ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`
            }
          >
            All Subcategories
          </Combobox.Option>

          {filteredSubs.length === 0 ? (
            <div className="p-2 text-gray-500">Nothing found.</div>
          ) : (
            filteredSubs.map((sub) => (
              <Combobox.Option
                key={sub.id}
                value={sub}
                className={({ active }) =>
                  `cursor-pointer select-none p-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`
                }
              >
                {sub.name}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
