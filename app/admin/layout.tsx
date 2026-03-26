"use client";

import AdminSidebar from '@/components/Layout/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, account, role, hasPermission, loading } = useAuth();
    const { t, isRTL } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!hasPermission('access_dashboard')) {
                // If the user is logged in but has no dashboard access, redirect home
                router.push('/');
            }
        }
    }, [user, loading, role, router, hasPermission]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
            </div>
        );
    }

    if (!user || !hasPermission('access_dashboard')) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <header className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                        <h1 className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('admin.dashboard')}</h1>
                    </div>
                </header>
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
