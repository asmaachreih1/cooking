"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import BlogCard from '@/components/shared/BlogCard';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '@/types';

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostAndRelated = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'blog', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const postData = { id: docSnap.id, ...docSnap.data() } as BlogPost;
                    setPost(postData);

                    // Fetch related posts
                    const relatedQuery = query(
                        collection(db, 'blog'),
                        limit(4)
                    );
                    const relatedSnap = await getDocs(relatedQuery);
                    const relatedData = relatedSnap.docs
                        .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
                        .filter(p => p.id !== id)
                        .slice(0, 3);
                    setRelatedPosts(relatedData);
                }
            } catch (error) {
                console.error("Error fetching blog post: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndRelated();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
                <p className="text-dark-brown/60 font-serif-elegant text-xl">Loading story...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <h2 className="font-serif-elegant text-3xl text-dark-brown mb-4">Post Not Found</h2>
                    <Link href="/blog" className="text-olive-green hover:text-terracotta transition-colors">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-cream min-h-screen">
            {/* Hero */}
            <section className="relative h-[50vh] min-h-[400px]">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-brown via-dark-brown/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-cream">
                    <div className="container mx-auto max-w-4xl">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-cream/80 hover:text-cream mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>

                        <span className="inline-block bg-olive-green/80 px-4 py-1 rounded-full text-sm font-medium mb-4">
                            {post.category}
                        </span>

                        <h1 className="font-serif-elegant text-4xl md:text-5xl mb-4">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-cream/80">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>5 min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-12">
                        {/* Article */}
                        <article className="lg:col-span-3">
                            <div className="bg-white rounded-3xl p-8 md:p-16 shadow-soft border border-warm-beige/20 text-dark-brown relative overflow-hidden">
                                {/* Decorative Corner Pattern */}
                                <div className="absolute -top-12 -right-12 w-32 h-32 tatreez-pattern opacity-10 rotate-12" />
                                <div className="absolute -bottom-12 -left-12 w-32 h-32 tatreez-pattern-red opacity-10 -rotate-12" />

                                <div className="prose prose-elegant prose-lg md:prose-xl max-w-none 
                                    prose-headings:font-serif-elegant prose-headings:font-semibold
                                    prose-p:leading-relaxed prose-p:mb-8
                                    prose-strong:text-terracotta prose-strong:font-bold
                                    prose-blockquote:border-l-4 prose-blockquote:border-terracotta prose-blockquote:bg-warm-beige/10 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-dark-brown/90
                                    prose-li:marker:text-olive-green
                                    [&>p:first-of-type]:first-letter:text-7xl 
                                    [&>p:first-of-type]:first-letter:font-serif-elegant 
                                    [&>p:first-of-type]:first-letter:font-bold 
                                    [&>p:first-of-type]:first-letter:text-olive-green 
                                    [&>p:first-of-type]:first-letter:mr-4 
                                    [&>p:first-of-type]:first-letter:float-left 
                                    [&>p:first-of-type]:first-letter:leading-none">
                                    <ReactMarkdown>{post.content}</ReactMarkdown>
                                </div>

                                {/* Decorative Divider */}
                                <div className="my-16 flex items-center justify-center gap-4 opacity-30">
                                    <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-olive-green" />
                                    <div className="w-2 h-2 rounded-full bg-terracotta" />
                                    <div className="w-3 h-3 rounded-full bg-olive-green" />
                                    <div className="w-2 h-2 rounded-full bg-terracotta" />
                                    <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-olive-green" />
                                </div>

                                {/* Author & Share Footer */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 border-t border-warm-beige/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-olive-green/10 rounded-full flex items-center justify-center text-olive-green font-serif-elegant text-2xl border border-olive-green/20">
                                            {post.author[0]}
                                        </div>
                                        <div>
                                            <p className="font-serif-elegant text-xl text-dark-brown leading-none">{post.author}</p>
                                            <p className="text-xs text-dark-brown/50 mt-1 uppercase tracking-widest font-bold">The Author</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-dark-brown text-sm uppercase tracking-wider">Share This Story:</span>
                                        <div className="flex gap-3">
                                            <button className="w-10 h-10 hover:scale-110 bg-[#1877F2] text-white rounded-full flex items-center justify-center transition-all shadow-md">
                                                <Facebook className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 hover:scale-110 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center transition-all shadow-md">
                                                <Twitter className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 hover:scale-110 bg-olive-green text-white rounded-full flex items-center justify-center hover:bg-terracotta transition-all shadow-md">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-8">
                                {/* Author */}
                                <div className="bg-white rounded-2xl p-6 shadow-soft border border-warm-beige/20">
                                    <h3 className="font-serif-elegant text-lg text-dark-brown mb-4">About the Author</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-olive-green/20 rounded-full flex items-center justify-center text-olive-green font-bold text-2xl">
                                            {post.author[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-dark-brown">{post.author}</p>
                                            <p className="text-sm text-dark-brown/60">Recipe Keeper</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-dark-brown/70 leading-relaxed">
                                        Sharing recipes and stories from three generations of Palestinian and Lebanese cooking.
                                    </p>
                                </div>

                                {/* Categories */}
                                <div className="bg-white rounded-2xl p-6 shadow-soft border border-warm-beige/20">
                                    <h3 className="font-serif-elegant text-lg text-dark-brown mb-4">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Culture', 'Ingredients', 'Stories', 'Techniques', 'Traditions'].map((cat) => (
                                            <span
                                                key={cat}
                                                className="px-4 py-1.5 bg-warm-beige/50 text-dark-brown/70 rounded-full text-xs font-semibold hover:bg-olive-green hover:text-white transition-all cursor-pointer border border-transparent hover:border-olive-green shadow-sm"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-12 bg-warm-beige/30">
                    <div className="container mx-auto px-4">
                        <h2 className="font-serif-elegant text-3xl text-dark-brown mb-10 text-center">
                            More Stories
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map((p) => (
                                <BlogCard key={p.id} post={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
