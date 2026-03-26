"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import NewsCard from '@/components/shared/NewsCard';
import ReactMarkdown from 'react-markdown';
import { NewsItem } from '@/types';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [news, setNews] = useState<NewsItem | null>(null);
    const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsAndRelated = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'news', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const newsData = { id: docSnap.id, ...docSnap.data() } as NewsItem;
                    setNews(newsData);

                    // Fetch related news
                    const relatedQuery = query(
                        collection(db, 'news'),
                        limit(3)
                    );
                    const relatedSnap = await getDocs(relatedQuery);
                    const relatedData = relatedSnap.docs
                        .map(doc => ({ id: doc.id, ...doc.data() } as NewsItem))
                        .filter(n => n.id !== id)
                        .slice(0, 2);
                    setRelatedNews(relatedData);
                }
            } catch (error) {
                console.error("Error fetching news: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsAndRelated();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
                <p className="text-dark-brown/60 font-serif-elegant text-xl">Loading heritage update...</p>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <h2 className="font-serif-elegant text-3xl text-dark-brown mb-4">Article Not Found</h2>
                    <Link href="/news" className="text-olive-green hover:text-terracotta transition-colors">
                        ← Back to News
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-cream min-h-screen text-dark-brown">
            {/* Hero */}
            <section className="relative h-[50vh] min-h-[400px]">
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-brown via-dark-brown/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-cream">
                    <div className="container mx-auto max-w-4xl">
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-cream/80 hover:text-cream mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to News
                        </Link>

                        <span className="inline-block bg-terracotta/80 px-4 py-1 rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
                            {news.category}
                        </span>

                        <h1 className="font-serif-elegant text-4xl md:text-5xl mb-4">
                            {news.title}
                        </h1>

                        <div className="flex items-center gap-2 text-cream/80">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatDate(news.date)}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <article className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-warm-beige/20">
                            <div className="prose prose-lg max-w-none prose-headings:font-serif-elegant prose-headings:text-dark-brown prose-p:text-dark-brown/80 prose-strong:text-dark-brown prose-li:text-dark-brown/80 prose-img:rounded-3xl">
                                <ReactMarkdown>{news.content}</ReactMarkdown>
                            </div>

                            {/* Share */}
                            <div className="mt-12 pt-8 border-t border-warm-beige/30">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-dark-brown text-sm">Share this news:</span>
                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shadow-md">
                                            <Facebook className="w-5 h-5" />
                                        </button>
                                        <button className="w-10 h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shadow-md">
                                            <Twitter className="w-5 h-5" />
                                        </button>
                                        <button className="w-10 h-10 bg-olive-green text-white rounded-full flex items-center justify-center hover:bg-terracotta transition-colors shadow-md">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Related News */}
            {relatedNews.length > 0 && (
                <section className="py-12 bg-warm-beige/30 border-t border-warm-beige/20">
                    <div className="container mx-auto px-4">
                        <h2 className="font-serif-elegant text-3xl text-dark-brown mb-10 text-center">
                            More News & Updates
                        </h2>
                        <div className="max-w-4xl mx-auto space-y-8">
                            {relatedNews.map((n) => (
                                <NewsCard key={n.id} news={n} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
