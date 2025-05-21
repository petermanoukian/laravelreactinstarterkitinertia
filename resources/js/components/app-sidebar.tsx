import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';
import { Users, UserPlus } from 'lucide-react';



const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {


    const { props } = usePage();
    const user = props.auth.user;


const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
];

if (user?.role === 'superadmin') {
  mainNavItems.push({
    title: 'Users',
    icon: Users,
    children: [
      {
        title: 'View',
        children: [
          { title: 'Superadmins', href: '/superadmin/users?role=superadmin' },
          { title: 'Admins', href: '/superadmin/users?role=admin' },
          { title: 'Users', href: '/superadmin/users?role=user' },
        ],
      },
      {
        title: 'Add',
        children: [
          { title: 'Add Superadmin', href: '/superadmin/adduser?role=superadmin' },
          { title: 'Add Admin', href: '/superadmin/adduser?role=admin' },
          { title: 'Add User', href: '/superadmin/adduser?role=user' },
        ],
      },
    ],
  });
} else {
  mainNavItems.push({
    title: 'Users',
    href: `/${user.role}/users`,
    icon: Users,
  });
}


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
