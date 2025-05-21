// resources/js/Pages/Superadmin/Pagination.tsx
import { Link } from "@inertiajs/react";

type PaginationProps = {
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  onPageChange?: (page: number) => void; // optional
};

export default function Pagination({ links, onPageChange }: PaginationProps) {
  return (
    <>
      {links.map((link, index) => {
        // parse page number from link.url, if any
        let page: number | null = null;
        if (link.url) {
          try {
            const url = new URL(link.url);
            page = Number(url.searchParams.get('page'));
          } catch {
            page = null;
          }
        }

        // If onPageChange is provided and link is clickable (url && !active), 
        // render a button that calls onPageChange(page).
        // Otherwise, fallback to normal <a> tag for default navigation.

        if (onPageChange && link.url && !link.active && page !== null) {
          return (
            <button
              key={index}
  disabled={!link.url || link.active}
  className={`px-3 py-1 rounded text-sm transition
    ${link.active ? 'bg-blue-600 text-white cursor-default' : 'bg-gray-200 text-gray-800'}
    ${link.url && !link.active ? 'cursor-pointer hover:bg-blue-100' : 'cursor-not-allowed opacity-50'}
  `}
              onClick={() => onPageChange(page!)}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        } else {
          // fallback: render a normal <a> for links (including active)
          return (
                <a
                key={index}
                href={link.url && !link.active ? link.url : undefined}
                onClick={(e) => {
                    if (!link.url || link.active) {
                    e.preventDefault(); // prevent navigation
                    }
                }}
                className={`px-3 py-1 rounded text-sm transition
                    ${link.active ? 'bg-blue-600 text-white cursor-default' : 'bg-gray-200 text-gray-800'}
                    ${link.url && !link.active ? 'hover:bg-blue-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                `}
                dangerouslySetInnerHTML={{ __html: link.label }}
                />
          );
        }
      })}
    </>
  );
}

