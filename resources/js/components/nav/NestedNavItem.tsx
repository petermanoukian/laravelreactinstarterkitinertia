import { useState } from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { type NavItem } from '@/types';

export function NestedNavItem({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: { title: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setOpen((prev) => !prev)}>
        {Icon && <Icon />}
        <span>{title}</span>
        <span className="ml-auto">{open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
      </SidebarMenuButton>

      {open && (
        <div className="ml-6">
          {children.map((child) => (
            <SidebarMenuItem key={child.title}>
              <SidebarMenuButton asChild>
                <Link href={child.href}>{child.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}
