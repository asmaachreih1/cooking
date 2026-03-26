"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import HeritageFlags from '@/components/shared/HeritageFlags';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
    const { t, isRTL } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const searchParams = useSearchParams();
    const signupSuccess = searchParams.get('signup') === 'success';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin');
        } catch (err: any) {
            setError(err.message || t('auth.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream tatreez-pattern flex items-center justify-center p-4 py-20 relative overflow-hidden">
            <HeritageFlags />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-md rounded-[40px] shadow-soft border border-warm-beige/30 p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative Patterns */}
                    <div className="absolute top-0 right-0 w-32 h-32 tatreez-pattern opacity-5 rotate-12 -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 tatreez-pattern-red opacity-5 -rotate-12 -ml-16 -mb-16" />

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-olive-green rounded-full mb-6 shadow-warm hover:scale-105 transition-transform">
                            <ChefHat className="w-8 h-8 text-white" />
                        </Link>
                        <h1 className="font-serif-elegant text-3xl text-dark-brown mb-2">{t('auth.welcomeBack')}</h1>
                        <p className="text-sm text-dark-brown/60 font-medium tracking-wide">{t('auth.culinarySanctuary')}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {signupSuccess && !error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                {t('auth.signupSuccess')}
                            </motion.div>
                        )}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                                <input
                                    type="email"
                                    placeholder={t('auth.emailLabel')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`w-full ${isRTL ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-4 bg-cream/50 border border-warm-beige/50 rounded-2xl focus:bg-white focus:border-olive-green focus:ring-4 focus:ring-olive-green/5 outline-none transition-all font-medium text-sm text-dark-brown`}
                                />
                            </div>
                            <div className="relative">
                                <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                                <input
                                    type="password"
                                    placeholder={t('auth.passwordLabel')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`w-full ${isRTL ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-4 bg-cream/50 border border-warm-beige/50 rounded-2xl focus:bg-white focus:border-olive-green focus:ring-4 focus:ring-olive-green/5 outline-none transition-all font-medium text-sm text-dark-brown`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs px-1">
                            <label className="flex items-center gap-2 text-dark-brown/60 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-warm-beige text-olive-green focus:ring-olive-green" />
                                <span className="group-hover:text-dark-brown transition-colors">{t('auth.rememberMe')}</span>
                            </label>
                            <a href="#" className="text-olive-green font-bold hover:text-terracotta transition-colors">{t('auth.forgotPassword')}</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-olive-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-warm hover:bg-terracotta transition-all active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{t('auth.signIn')}</span>
                                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm text-dark-brown/60">
                        {t('auth.noAccount')}{' '}
                        <Link href="/signup" className="text-olive-green font-bold hover:text-terracotta transition-colors underline underline-offset-4">
                            {t('auth.createHeritageAccount')}
                        </Link>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-dark-brown/40 font-medium italic">
                    "{t('auth.loginQuote')}"
                </p>
            </motion.div>
        </div>
    );
}
