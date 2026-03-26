"use client";

import { useEffect, useState } from 'react';
import BlogCard from '@/components/shared/BlogCard';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { BlogPost } from '@/types';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPage() {
    const { t, language, df } = useLanguage();
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const postData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as BlogPost[];
                setBlogPosts(postData);
            } catch (error) {
                console.error("Error fetching blog posts: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
                <p className="text-dark-brown/60 font-serif-elegant text-xl">{t('blog.loadingStories')}</p>
            </div>
        );
    }

    if (blogPosts.length === 0) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <p className="text-dark-brown/60 font-serif-elegant text-xl">{t('blog.noStories')}</p>
            </div>
        );
    }

    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1);
    return (
        <div className="bg-cream min-h-screen">
            {/* Hero Section */}
            <section className="relative py-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-dark-brown/60 z-10" />
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 tatreez-pattern opacity-10 z-10" />
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <span className="text-light-olive font-medium mb-3 block tracking-widest uppercase text-sm">{t('home.fromOurKitchen')}</span>
                    <h1 className="font-serif-elegant text-5xl md:text-7xl mb-6 text-cream">
                        {t('blog.storiesTips')}
                    </h1>
                    <p className="text-cream/80 max-w-2xl mx-auto text-xl font-light">
                        {t('blog.heroDesc')}
                    </p>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-12 -mt-20 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-warm overflow-hidden border border-warm-beige/20">
                        <div className="grid lg:grid-cols-2">
                            <div className="h-64 lg:h-auto overflow-hidden">
                                <img
                                    src={featuredPost.image}
                                    alt={df(featuredPost, 'title')}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <span className="inline-block bg-olive-green/10 text-olive-green px-4 py-1 rounded-full text-xs font-bold mb-4 w-fit uppercase tracking-wider">
                                    {t('blog.featuredStory')}
                                </span>
                                <h2 className="font-serif-elegant text-3xl md:text-4xl text-dark-brown mb-4 hover:text-terracotta transition-colors cursor-pointer">
                                    {df(featuredPost, 'title')}
                                </h2>
                                <p className="text-dark-brown/70 mb-8 leading-relaxed">
                                    {df(featuredPost, 'excerpt')}
                                </p>
                                <div className="flex items-center gap-6 text-xs font-medium text-dark-brown/60 border-t border-warm-beige/30 pt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-olive-green/20 rounded-full flex items-center justify-center text-olive-green font-bold">
                                            {featuredPost.author?.[0] || 'A'}
                                        </div>
                                        <span>{featuredPost.author}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{new Date(featuredPost.date).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherPosts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 bg-warm-beige/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-3xl shadow-soft border border-warm-beige/20">
                        <h2 className="font-serif-elegant text-3xl text-dark-brown mb-4">
                            {t('blog.neverMissStory')}
                        </h2>
                        <p className="text-dark-brown/70 mb-10 text-sm">
                            {t('blog.subscribeDesc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder={t('home.emailPlaceholder')}
                                className="flex-1 px-6 py-4 rounded-full border border-warm-beige bg-cream/30 focus:border-olive-green focus:ring-2 focus:ring-olive-green/20 transition-all text-sm outline-none"
                            />
                            <button className="bg-olive-green text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-terracotta transition-all shadow-md active:scale-95">
                                {t('home.subscribe')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
