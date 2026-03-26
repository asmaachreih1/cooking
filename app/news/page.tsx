"use client";

import { useEffect, useState } from 'react';
import NewsCard from '@/components/shared/NewsCard';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { NewsItem } from '@/types';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsPage() {
    const { t, df } = useLanguage();
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'news'), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const newsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as NewsItem[];
                setNewsItems(newsData);
            } catch (error) {
                console.error("Error fetching news: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
                <p className="text-dark-brown/60 font-serif-elegant text-xl">{t('news.fetchingNews')}</p>
            </div>
        );
    }
    return (
        <div className="bg-cream min-h-screen">
            {/* Hero Section */}
            <section className="relative py-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-dark-brown/60 z-10" />
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 tatreez-pattern opacity-10 z-10" />
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <span className="text-light-olive font-medium mb-3 block tracking-widest uppercase text-sm">{t('news.whatsHappening')}</span>
                    <h1 className="font-serif-elegant text-5xl md:text-7xl mb-6 text-cream">
                        {t('news.newsUpdates')}
                    </h1>
                    <p className="text-cream/80 max-w-2xl mx-auto text-xl font-light">
                        {t('news.heroDesc')}
                    </p>
                </div>
            </section>

            {/* News Timeline */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {newsItems.map((news, index) => (
                            <div key={news.id} className="relative">
                                {/* Timeline Line */}
                                {index < newsItems.length - 1 && (
                                    <div className="hidden md:block absolute left-6 top-24 bottom-0 w-0.5 bg-warm-beige" />
                                )}

                                {/* Timeline Dot */}
                                <div className="hidden md:flex absolute left-4 top-10 w-5 h-5 bg-olive-green rounded-full border-4 border-cream z-10 shadow-sm" />

                                <div className="md:ml-16">
                                    <NewsCard news={news} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
