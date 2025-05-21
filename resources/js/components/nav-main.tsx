import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom' 
import { isItemActive } from '@/lib/navSuperAdminUtils';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: any[] }) {
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <RenderNavItems items={items} depth={0} />
      </SidebarMenu>
    </SidebarGroup>
  );
}

function RenderNavItems({ items, depth }: { items: any[]; depth: number }) {
  const { url } = usePage();
  const [openItem, setOpenItem] = useState<string | null>(null);

  //const queryParams = new URLSearchParams(window.location.search)
  //const currentRole = queryParams.get('role')

  // Auto-open parent menus if one of the children matches current URL
  useEffect(() => {
    for (const item of items) {
      if (hasMatchingChild(item, url)) {
        setOpenItem(item.title);
        break;
      }
    }
  }, [items, url]);

  return (
    <>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openItem === item.title;

        const location = new URL(window.location.href);
        const currentPath = location.pathname;
        const currentQuery = location.searchParams;

        const isActive = isItemActive(item.href, currentPath, currentQuery);
        /*
        const isActive =
        item.href && currentRole
            ? item.href.includes(`role=${currentRole}`)
            : false;
        */





        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild={!hasChildren}
              onClick={() => {
                if (!hasChildren) return;
                setOpenItem(isOpen ? null : item.title);
              }}
              tooltip={{ children: item.title }}
            >
              {hasChildren ? (
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center space-x-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </div>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-2 ${
                    isActive ? 'text-blue-600 font-bold' : ''
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>

            {hasChildren && isOpen && (
              <div className="ml-4 border-l border-muted-foreground/20 pl-4">
                <RenderNavItems items={item.children} depth={depth + 1} />
              </div>
            )}
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

// 🔍 Helper: check if this item or any of its children match the current URL
function hasMatchingChild(item: any, url: string): boolean {
  if (item.href && url.startsWith(item.href)) {
    return true;
  }
  if (item.children) {
    return item.children.some((child: any) => hasMatchingChild(child, url));
  }
  return false;
}

// 🔍 Helper: exact match or startsWith match
function isCurrentUrl(item: any, url: string): boolean {
  return item.href && url.startsWith(item.href);
}
