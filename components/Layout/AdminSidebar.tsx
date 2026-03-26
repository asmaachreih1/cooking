"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import {
    ChefHat, FileText, Newspaper, Briefcase, MessageSquare, Users,
    TrendingUp, Home, LogOut, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/types';

export default function AdminSidebar() {
    const { t, isRTL } = useLanguage();
    const pathname = usePathname();
    
    const sidebarItems = [
        { id: 'overview', href: '/admin', icon: <TrendingUp className="w-5 h-5" />, label: t('admin.overview'), permission: PERMISSIONS.ACCESS_DASHBOARD },
        { id: 'recipes', href: '/admin/recipes', icon: <ChefHat className="w-5 h-5" />, label: t('admin.recipes'), permission: PERMISSIONS.EDIT_RECIPE },
        { id: 'blog', href: '/admin/blog', icon: <FileText className="w-5 h-5" />, label: t('admin.blog'), permission: PERMISSIONS.EDIT_BLOG },
        { id: 'news', href: '/admin/news', icon: <Newspaper className="w-5 h-5" />, label: t('admin.news'), permission: PERMISSIONS.EDIT_NEWS },
        { id: 'users', href: '/admin/users', icon: <Users className="w-5 h-5" />, label: t('admin.users'), permission: PERMISSIONS.MANAGE_USERS },
        { id: 'roles', href: '/admin/roles', icon: <ShieldCheck className="w-5 h-5" />, label: t('admin.roles'), permission: PERMISSIONS.MANAGE_ROLES },
    ];
    const { user, account, role, hasPermission, logout } = useAuth();

    const filteredItems = sidebarItems.filter(item => hasPermission(item.permission));

    return (
        <aside className={`w-64 bg-[#2D2D2D] text-[#F5F5DC] flex flex-col h-screen sticky top-0 overflow-y-auto ${isRTL ? 'border-l border-white/10' : 'border-r border-white/10'}`}>
            <div className="p-6 border-b border-white/10">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-12 h-12 bg-[#556B2F] rounded-full flex items-center justify-center shadow-lg text-white font-serif-elegant font-bold text-xl border-2 border-white/10 uppercase">
                        {(account?.displayName?.[0] || user?.email?.[0] || 'A')}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{account?.displayName || user?.displayName || 'Admin'}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold truncate">{role?.name || 'Viewer'}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 py-6">
                <ul className="space-y-1 px-3">
                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isRTL ? 'flex-row-reverse text-right' : ''} ${isActive
                                            ? 'bg-[#556B2F] text-white shadow-md'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-white' : 'group-hover:text-[#556B2F]'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} w-1.5 h-1.5 bg-white rounded-full shadow-glow`} />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 space-y-2 border-t border-white/10">
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all group ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                    <Home className="w-5 h-5 group-hover:text-[#B22222]" />
                    <span className="font-medium text-sm">{t('admin.viewWebsite')}</span>
                </Link>
                <button
                    onClick={logout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-[#B22222]/10 hover:text-[#B22222] transition-all group ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">{t('admin.signOut')}</span>
                </button>
            </div>
        </aside>
    );
}
