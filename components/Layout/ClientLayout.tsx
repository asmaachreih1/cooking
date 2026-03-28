"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import AskMomChat from "@/components/Chat/AskMomChat";
import SplashScreen from "@/components/Layout/SplashScreen";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminPage = pathname?.startsWith('/admin');
  const hideGlobalUI = isAuthPage || isAdminPage;

  useEffect(() => {
    if (!showSplash && pathname === '/' && !loading && !user) {
      router.push('/login');
    }
  }, [showSplash, pathname, user, loading, router]);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col"
        >
          {!isAdminPage && <Header />}
          <main className="flex-grow">
            {children}
          </main>
          {!hideGlobalUI && <Footer />}
          {/* Only show AskMomChat when user is logged in and not on admin pages */}
          {user && !isAdminPage && <AskMomChat />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ClientLayoutContent>
          {children}
        </ClientLayoutContent>
      </LanguageProvider>
    </AuthProvider>
  );
}
