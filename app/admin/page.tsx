"use client";

import { useEffect, useState } from 'react';
import AdminLayout from './layout';
import Link from 'next/link';
import { ChefHat, FileText, Newspaper, MessageSquare, TrendingUp, Loader2, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Recipe, UserSubmission, BlogPost, PERMISSIONS } from '@/types';

export default function AdminOverview() {
    const { hasPermission } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Total Recipes', value: 0, icon: <ChefHat className="w-6 h-6" />, color: 'olive-green' },
        { label: 'Blog Posts', value: 0, icon: <FileText className="w-6 h-6" />, color: 'terracotta' },
        { label: 'News Items', value: 0, icon: <Newspaper className="w-6 h-6" />, color: 'deep-red' },
        { label: 'Submissions', value: 0, icon: <MessageSquare className="w-6 h-6" />, color: 'olive-green' },
    ]);
    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
    const [recentSubmissions, setRecentSubmissions] = useState<UserSubmission[]>([]);
    const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [recipesSnap, blogSnap, newsSnap, submissionsSnap] = await Promise.all([
                    getDocs(collection(db, 'recipes')),
                    getDocs(collection(db, 'blog')),
                    getDocs(collection(db, 'news')),
                    getDocs(collection(db, 'submissions'))
                ]);

                setStats([
                    { label: 'Total Recipes', value: recipesSnap.size, icon: <ChefHat className="w-6 h-6" />, color: 'olive-green' },
                    { label: 'Blog Posts', value: blogSnap.size, icon: <FileText className="w-6 h-6" />, color: 'terracotta' },
                    { label: 'News Items', value: newsSnap.size, icon: <Newspaper className="w-6 h-6" />, color: 'deep-red' },
                    { label: 'Submissions', value: submissionsSnap.size, icon: <MessageSquare className="w-6 h-6" />, color: 'olive-green' },
                ]);

                // Fetch recent recipes
                const recipesQ = query(collection(db, 'recipes'), limit(4));
                const recentRecipesSnap = await getDocs(recipesQ);
                setRecentRecipes(recentRecipesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe)));

                // Fetch recent blogs
                const blogsQ = query(collection(db, 'blog'), orderBy('date', 'desc'), limit(4));
                const recentBlogsSnap = await getDocs(blogsQ);
                setRecentBlogs(recentBlogsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));

                // Fetch recent submissions
                if (hasPermission(PERMISSIONS.MANAGE_SUBMISSIONS)) {
                    const submissionsQ = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'), limit(4));
                    const recentSubmissionsSnap = await getDocs(submissionsQ);
                    setRecentSubmissions(recentSubmissionsSnap.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate()?.toLocaleString() || 'Just now'
                    } as any)));
                }

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [hasPermission]);

    // Helper to get relative time or formatted date
    const formatDate = (dateString: string) => {
        return dateString;
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:border-olive-green/30 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <div className="text-dark-brown">{stat.icon}</div>
                            </div>
                            <span className="text-3xl font-serif-elegant font-bold text-dark-brown">{stat.value}</span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Content (Submissions for Admin, Blogs for Editor) */}
                <div className="bg-white rounded-[32px] shadow-soft border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta">
                                {hasPermission(PERMISSIONS.MANAGE_SUBMISSIONS) ? (
                                    <MessageSquare className="w-5 h-5" />
                                ) : (
                                    <BookOpen className="w-5 h-5" />
                                )}
                            </div>
                            <h2 className="font-serif-elegant text-xl text-dark-brown">
                                {hasPermission(PERMISSIONS.MANAGE_SUBMISSIONS) ? 'Recent Submissions' : 'Recent Blog Posts'}
                            </h2>
                        </div>
                        <Link
                            href={hasPermission(PERMISSIONS.MANAGE_SUBMISSIONS) ? "/admin/submissions" : "/admin/blog"}
                            className="text-sm font-bold text-olive-green hover:text-terracotta transition-colors"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {hasPermission(PERMISSIONS.MANAGE_SUBMISSIONS) ? (
                            recentSubmissions.length === 0 ? (
                                <div className="p-10 text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No recent messages</p>
                                </div>
                            ) : recentSubmissions.map((submission) => (
                                <div key={submission.id} className="p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="w-10 h-10 bg-olive-green/10 rounded-full flex items-center justify-center flex-shrink-0 text-olive-green font-bold text-xs">
                                        {submission.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-dark-brown text-sm">{submission.name}</p>
                                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${submission.status === 'new' ? 'bg-olive-green text-white shadow-sm' :
                                                    submission.status === 'pending' ? 'bg-terracotta/20 text-terracotta' :
                                                        'bg-gray-100 text-gray-400'
                                                }`}>
                                                {submission.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-xs italic truncate">"{submission.message}"</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{submission.subject.replace('-', ' ')}</span>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <span className="text-[10px] text-gray-400">{(submission as any).createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            recentBlogs.length === 0 ? (
                                <div className="p-10 text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No recent blog posts</p>
                                </div>
                            ) : recentBlogs.map((blog) => (
                                <div key={blog.id} className="p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-soft flex-shrink-0">
                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-dark-brown text-sm mb-1 truncate">{blog.title}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-olive-green font-bold uppercase tracking-widest">{blog.category}</span>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{blog.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Recipes */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-serif-elegant text-xl text-dark-brown">Recent Recipes</h3>
                        <Link href="/admin/recipes" className="text-sm font-bold text-olive-green hover:text-terracotta transition-colors">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentRecipes.map((recipe) => (
                            <div key={recipe.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-dark-brown">{recipe.title}</p>
                                    <p className="text-gray-400 text-xs font-medium capitalize">{recipe.category} • {recipe.type}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter ${recipe.category === 'lebanese' ? 'bg-deep-red/10 text-deep-red' : 'bg-olive-green/10 text-olive-green'
                                        }`}>
                                        {recipe.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
