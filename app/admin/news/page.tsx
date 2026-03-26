"use client";

import { useEffect, useState } from 'react';
import {
    Newspaper, Plus, Edit, Trash2, Search, XCircle, Loader2
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { NewsItem, PERMISSIONS } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function NewsManagement() {
    const { hasPermission } = useAuth();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewsForm, setShowNewsForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [formData, setFormData] = useState<Partial<NewsItem>>({
        title: '',
        title_ar: '',
        excerpt: '',
        excerpt_ar: '',
        content: '',
        content_ar: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Event'
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'news'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const newsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as NewsItem[];
            setNews(newsData);
        } catch (error) {
            console.error("Error fetching news: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this news article?')) {
            try {
                await deleteDoc(doc(db, 'news', id));
                setNews(prev => prev.filter(n => n.id !== id));
            } catch (error) {
                console.error("Error deleting news: ", error);
            }
        }
    };

    const handleEdit = (item: NewsItem) => {
        setEditingNews(item);
        setFormData(item);
        setShowNewsForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingNews) {
                const docRef = doc(db, 'news', editingNews.id);
                await updateDoc(docRef, formData);
            } else {
                await addDoc(collection(db, 'news'), formData);
            }
            setShowNewsForm(false);
            setEditingNews(null);
            setFormData({
                title: '',
                title_ar: '',
                excerpt: '',
                excerpt_ar: '',
                content: '',
                content_ar: '',
                image: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Event'
            });
            fetchNews();
        } catch (error) {
            console.error("Error saving news: ", error);
        }
    };

    const filteredNews = news.filter(n => {
        const matchesSearch = n.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || n.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-bold" />
                        <input
                            type="text"
                            placeholder="Search news articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all outline-none font-medium text-sm shadow-soft"
                        />
                    </div>
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 transition-all font-bold text-xs text-dark-brown shadow-soft outline-none focus:ring-2 focus:ring-olive-green/20"
                    >
                        <option value="all">All Categories</option>
                        <option value="Event">Event</option>
                        <option value="Update">Update</option>
                        <option value="Community">Community</option>
                        <option value="Award">Award</option>
                    </select>
                </div>
                {hasPermission(PERMISSIONS.CREATE_NEWS) && (
                    <button 
                        onClick={() => {
                            setEditingNews(null);
                            setFormData({
                                title: '',
                                title_ar: '',
                                excerpt: '',
                                excerpt_ar: '',
                                content: '',
                                content_ar: '',
                                image: '',
                                date: new Date().toISOString().split('T')[0],
                                category: 'Event'
                            });
                            setShowNewsForm(true);
                        }}
                        className="flex items-center gap-2 bg-dark-brown text-white px-8 py-3 rounded-2xl hover:bg-terracotta transition-all font-bold text-sm shadow-warm active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Post Internal News</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[32px] shadow-soft border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-olive-green animate-spin" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching Heritage News...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredNews.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No news articles found</p>
                                    </td>
                                </tr>
                            ) : filteredNews.map((news) => (
                                <tr key={news.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <img src={news.image} alt={news.title} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                            <div>
                                                <p className="font-bold text-dark-brown text-sm mb-1 line-clamp-1">{news.title}</p>
                                                <p className="text-[10px] text-gray-400 font-medium truncate max-w-xs">{news.excerpt}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-terracotta/10 text-terracotta uppercase tracking-tighter">
                                            {news.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 text-xs font-medium">{news.date}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            {hasPermission(PERMISSIONS.EDIT_NEWS) && (
                                                <button 
                                                    onClick={() => handleEdit(news)}
                                                    className="p-2.5 hover:bg-white hover:shadow-soft rounded-xl transition-all"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-400 hover:text-terracotta" />
                                                </button>
                                            )}
                                            {hasPermission(PERMISSIONS.DELETE_NEWS) && (
                                                <button 
                                                    onClick={() => handleDelete(news.id)}
                                                    className="p-2.5 hover:bg-red-50 rounded-xl transition-all group/delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-400 group-hover/delete:text-deep-red" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - News Form */}
            {showNewsForm && (
                <div className="fixed inset-0 bg-dark-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-serif-elegant text-dark-brown">
                                    {editingNews ? 'Edit News Article' : 'Post New Article'}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">Keep the community informed about our journey.</p>
                            </div>
                            <button
                                onClick={() => setShowNewsForm(false)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-dark-brown"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Article Title (EN)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                            placeholder="e.g., Opening Our New Heritage Kitchen"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Article Title (AR)</label>
                                        <input
                                            type="text"
                                            value={formData.title_ar}
                                            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm text-right"
                                            dir="rtl"
                                            placeholder="العنوان بالعربية..."
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Excerpt (EN)</label>
                                        <textarea
                                            required
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                            rows={2}
                                            placeholder="A short summary..."
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Excerpt (AR)</label>
                                        <textarea
                                            value={formData.excerpt_ar}
                                            onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm text-right"
                                            dir="rtl"
                                            rows={2}
                                            placeholder="ملخص بالعربية..."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Image URL</label>
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                        >
                                            <option value="Event">Event</option>
                                            <option value="Update">Update</option>
                                            <option value="Community">Community</option>
                                            <option value="Award">Award</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Publish Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Content (EN)</label>
                                        <textarea
                                            required
                                            rows={12}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-6 py-4 rounded-[24px] border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-medium text-dark-brown outline-none shadow-sm custom-scrollbar"
                                            placeholder="Full article in English..."
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Content (AR)</label>
                                        <textarea
                                            rows={12}
                                            value={formData.content_ar}
                                            onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                                            className="w-full px-6 py-4 rounded-[24px] border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-medium text-dark-brown outline-none shadow-sm custom-scrollbar text-right"
                                            dir="rtl"
                                            placeholder="المقال كاملاً بالعربية..."
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="hidden" id="news-submit-btn" />
                            </form>
                        </div>

                        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/30">
                            <button
                                onClick={() => setShowNewsForm(false)}
                                className="px-8 py-3 rounded-2xl border border-gray-200 hover:bg-white transition-all font-bold text-gray-500 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => document.getElementById('news-submit-btn')?.click()}
                                className="px-10 py-3 bg-dark-brown text-white rounded-2xl hover:bg-terracotta transition-all font-bold shadow-warm active:scale-95"
                            >
                                {editingNews ? 'Update Article' : 'Post Article'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
