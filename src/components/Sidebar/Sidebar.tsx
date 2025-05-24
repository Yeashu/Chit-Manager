'use client'

import Link from 'next/link';
import { IconHome, IconUsers, IconWallet, IconFileText, IconSettings, IconLogout, IconBell } from '@tabler/icons-react';
import { useUser } from '@/hooks/useUser';
import { logout } from '@/app/auth/actions';
import NotificationBadge from '@/components/NotificationBadge';

interface SidebarProps {
  activeItem?: 'dashboard' | 'groups' | 'payments' | 'reports' | 'settings' | 'members' | 'auctions' | 'notifications';
  siteName?: string;
}

const Sidebar = ({ activeItem = 'dashboard', siteName = 'Chit Funds' }: SidebarProps) => {
  const { user, loading } = useUser();
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <IconHome size={20} stroke={1.5} />, 
      href: '/dashboard' 
    },
    { 
      id: 'groups', 
      label: 'My Groups', 
      icon: <IconUsers size={20} stroke={1.5} />, 
      href: '/MyGroups' 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: (
        <div className="relative">
          <IconBell size={20} stroke={1.5} />
          <NotificationBadge />
        </div>
      ), 
      href: '/notifications' 
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <IconWallet size={20} stroke={1.5} />, 
      href: '/payments' 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: <IconFileText size={20} stroke={1.5} />, 
      href: '/reports' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <IconSettings size={20} stroke={1.5} />, 
      href: '/settings' 
    }
  ];

  return (
    <div className="w-full max-w-[250px] h-screen bg-[#1c2c1c] text-white p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 mt-2">{siteName}</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  activeItem === item.id 
                    ? 'bg-[#2a3a2a] text-white' 
                    : 'text-gray-300 hover:bg-[#2a3a2a] hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Info and Logout */}
      {!loading && user && (
        <div className="border-t border-[#2a3a2a] pt-4 mt-4">
          <div className="mb-3 px-2">
            <div className="text-sm font-medium text-white truncate">
              {user.user_metadata?.full_name || user.email}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user.email}
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 p-2 rounded-md text-gray-300 hover:bg-[#2a3a2a] hover:text-white transition-colors"
            >
              <IconLogout size={20} stroke={1.5} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
