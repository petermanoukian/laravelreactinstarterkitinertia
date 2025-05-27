import { Head, usePage , router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState , useEffect, useCallback, useMemo} from 'react';
import debounce from 'lodash.debounce';
import { Link } from '@inertiajs/react';
import { route } from '@/ziggy';
import CatFilter from '@/components/Superadmin/Cat/CatFilter';
import CatTableHeader from '@/components/Superadmin/Cat/CatTableHeader'; 
import CatTableRow from '@/components/Superadmin/Cat/CatTableRow'; 
import Pagination from "@/components/Superadmin/Pagination";
import customAxios from '@/lib/axios';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'


 type Cat = {
    id: number;
    name: string;
    };

    type PaginatedCats = {
    data: Cat[];
    current_page: number;
    last_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    };

    export default function ViewCat({
    cats,
    filters = {},
    }: {
    cats: PaginatedCats;
    filters?: Filters;
    }) {

    const [search, setSearch] = useState(filters.search ?? '');
    const [sort, setSort] = useState(filters.sort ?? 'id');
    const [direction, setDirection] = useState(filters.direction ?? 'desc');
    const [page, setPage] = useState(1);

    const {auth} = usePage().props;
  
    const [selectedIds, setSelectedIds] = useState<number[]>([]);


    const applyFilters = useCallback((overrideFilters = {}) => {
        let newFilters = {

            search,
            sort,
            direction,
            page,
            ...overrideFilters,
        };

        if (newFilters.page === 1) {
            delete newFilters.page;
        }
        // Remove keys where the value is '' or null or undefined
        Object.keys(newFilters).forEach((key) => {
            const val = newFilters[key as keyof typeof newFilters];
            if (val === '' || val === null || val === undefined) {
            delete newFilters[key as keyof typeof newFilters];
            }
        });

        if (overrideFilters.sort) setSort(overrideFilters.sort);
        if (overrideFilters.direction) setDirection(overrideFilters.direction);
        if (overrideFilters.page) setPage(overrideFilters.page);


        router.get(route('superadmin.cats.index'), newFilters, {
        
    
            preserveState: true,
            replace: true,
        });
    }, [search,  sort, direction, page]);

    const debouncedSearch = useMemo(() => 
    debounce((value: string) => {
        applyFilters({ search: value });
    }, 300),
    [applyFilters]
    );


    useEffect(() => {
        if (search.length >= 2 || search.length === 0) {
        debouncedSearch(search);
        }
    }, [debouncedSearch, search]);

    const sortBy = (field: string) => {
          const isCurrent = sort === field;
          const newDirection = isCurrent && direction === 'asc' ? 'desc' : 'asc';
  
          applyFilters({ sort: field, direction: newDirection, page: 1 });
      };
    
    
      const handleDelete = async (id: number) => {
        try 
        {
          const url = route('superadmin.cat.destroy', { id });
          const response = await fetch(url, {
              method: 'DELETE',
              headers: {
                  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                  'Accept': 'application/json',
              },
          });

          if (!response.ok) {
              const err = await response.json();
              alert(`Error: ${err.message || 'Failed to delete user.'}`);
              return;
          }
          applyFilters({ page: 1 }); // reset to page 1 after delete (optional)
        } 
        catch (error) 
        {
            alert('Unexpected error occurred while deleting user.');
            console.error(error);
        }
      };

      const toggleSelect = (id: number) => {
              setSelectedIds(prev =>
                  prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
              );
      };
      
      const toggleSelectAll = () => {
          const allIds = cats.data
          .map(u => u.id);
          const isAllSelected = allIds.every(id => selectedIds.includes(id));
          setSelectedIds(isAllSelected ? [] : allIds);
      };
  
      const handleDeleteSelected = async () => 
      {
          if (selectedIds.length === 0) return alert("No rows selected.");
          try {
              const response = await fetch(route('superadmin.cats.destroyAll'), {
                  method: 'POST',
                  headers: {
                      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ ids: selectedIds }),
              });
  
              const data = await response.json();
  
              if (!response.ok) {
                  alert(`Error: ${data.message || 'Failed to delete .'}`);
                  return;
              }
  
              //alert(data.message);
              setSelectedIds([]);
              applyFilters({ page: 1 });
  
          } catch (error) {
              console.error(error);
              alert("Unexpected error during bulk delete.");
          }
      };


  return (
    
        <>
        <Head title="View Categories" />
        <AppLayout>
        <div className="p-4">
            <p>
                <Link href="/superadmin/cat/add" prefetch
                 className="mb-2 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                 py-2 px-4 rounded shadow"
                >
                    Add Categories
                </Link>
            </p>

            <CatFilter
                search={search}
                setSearch={setSearch}
            />

            <table className="min-w-full border text-sm text-left mt-4">
                 <CatTableHeader
                        filters={filters}
                        sortBy={sortBy}
                        toggleSelectAll={toggleSelectAll}
                        cats={cats}
                        selectedIds={selectedIds}
                    
                    />

                <tbody>

                    {cats.data.map((cat) => (
                        <CatTableRow
                        key={cat.id}
                        cat={cat}
                        selectedIds={selectedIds}
                        toggleSelect={toggleSelect}

                        handleDelete={handleDelete}
                        />
                    ))}
 
                </tbody>
            </table>

            {selectedIds.length > 0 && (
                <div className="mb-4 mt-4 text-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            disabled={selectedIds.length === 0}
                            >
                            Delete Selected ({selectedIds.length})
                            </button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>
                                Are you sure you want to delete {selectedIds.length} selected user{selectedIds.length > 1 ? 's' : ''}?
                            </DialogTitle>
                            </DialogHeader>

                            <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteSelected}
                            >
                                Confirm
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>

                </div>
            )}

            <div className="mt-4 flex gap-2">
                <Pagination
                links={cats.links}
                onPageChange={(page) => applyFilters({ page })}
                />
            </div>

        </div>
        </AppLayout>
        </>



  )
}

 