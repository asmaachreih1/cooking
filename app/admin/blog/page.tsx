"use client";

import { useEffect, useState } from 'react';
import {
    BookOpen, Plus, Edit, Trash2, Search, XCircle, Loader2, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { BlogPost, PERMISSIONS } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translateFields } from '@/lib/translate-client';

export default function BlogManagement() {
    const { hasPermission } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPostForm, setShowPostForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showArabic, setShowArabic] = useState(false);
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        title_ar: '',
        excerpt: '',
        excerpt_ar: '',
        content: '',
        content_ar: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Heritage',
        author: 'Mama Montaha',
        readTime: '5 min read'
    });

    const handleTranslate = async () => {
        if (!formData.title) {
            alert('Please enter at least the English title to translate.');
            return;
        }

        setIsTranslating(true);
        try {
            const fieldsToTranslate = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content
            };

            const translated = await translateFields(fieldsToTranslate);
            if (translated) {
                setFormData(prev => ({
                    ...prev,
                    title_ar: translated.title || prev.title_ar,
                    excerpt_ar: translated.excerpt || prev.excerpt_ar,
                    content_ar: translated.content || prev.content_ar
                }));
            }
        } catch (error) {
            console.error('Translation error:', error);
            alert('Failed to translate. Please try again or fill manually.');
        } finally {
            setIsTranslating(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const postData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as BlogPost[];
            setPosts(postData);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await deleteDoc(doc(db, 'blog', id));
                setPosts(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting post: ", error);
            }
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            ...post,
            title_ar: post.title_ar || '',
            excerpt_ar: post.excerpt_ar || '',
            content_ar: post.content_ar || ''
        });
        setShowPostForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalData = { ...formData };
            
            // Auto-translate if Arabic fields are empty
            const needsTranslation = !finalData.title_ar || !finalData.excerpt_ar || !finalData.content_ar;
            
            if (needsTranslation && finalData.title) {
                const translated = await translateFields({
                    title: finalData.title,
                    excerpt: finalData.excerpt,
                    content: finalData.content
                });
                
                if (translated) {
                    finalData = {
                        ...finalData,
                        title_ar: finalData.title_ar || translated.title,
                        excerpt_ar: finalData.excerpt_ar || translated.excerpt,
                        content_ar: finalData.content_ar || translated.content
                    };
                }
            }

            if (editingPost) {
                const postRef = doc(db, 'blog', editingPost.id);
                await updateDoc(postRef, finalData);
            } else {
                await addDoc(collection(db, 'blog'), finalData);
            }
            setShowPostForm(false);
            setEditingPost(null);
            setFormData({
                title: '',
                title_ar: '',
                excerpt: '',
                excerpt_ar: '',
                content: '',
                content_ar: '',
                image: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Heritage',
                author: 'Mama Montaha'
            });
            fetchPosts();
        } catch (error) {
            console.error("Error saving post: ", error);
        }
    };

    const filteredPosts = posts.filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
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
                            placeholder="Search blog posts..."
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
                        <option value="Culture">Culture</option>
                        <option value="Ingredients">Ingredients</option>
                        <option value="Stories">Stories</option>
                        <option value="Techniques">Techniques</option>
                        <option value="Traditions">Traditions</option>
                    </select>
                </div>
                {hasPermission(PERMISSIONS.CREATE_BLOG) && (
                    <button 
                        onClick={() => {
                            setEditingPost(null);
                            setFormData({
                                title: '',
                                title_ar: '',
                                excerpt: '',
                                excerpt_ar: '',
                                content: '',
                                content_ar: '',
                                image: '',
                                date: new Date().toISOString().split('T')[0],
                                category: 'Heritage',
                                author: 'Mama Montaha'
                            });
                            setShowPostForm(true);
                        }}
                        className="flex items-center gap-2 bg-olive-green text-white px-8 py-3 rounded-2xl hover:bg-terracotta transition-all font-bold text-sm shadow-warm active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Blog Post</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[32px] shadow-soft border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Post</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-olive-green animate-spin" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Heritage Stories...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No stories found</p>
                                    </td>
                                </tr>
                            ) : filteredPosts.map((post) => (
                                <tr key={post.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <img src={post.image} alt={post.title} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                            <div>
                                                <p className="font-bold text-dark-brown text-sm mb-1 line-clamp-1">{post.title}</p>
                                                <p className="text-[10px] text-gray-400 font-medium truncate max-w-xs">{post.excerpt}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-gray-500 font-bold text-xs">{post.author}</td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-olive-green/10 text-olive-green uppercase tracking-tighter">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 text-xs font-medium">{post.date}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            {hasPermission(PERMISSIONS.EDIT_BLOG) && (
                                                <button 
                                                    onClick={() => handleEdit(post)}
                                                    className="p-2.5 hover:bg-white hover:shadow-soft rounded-xl transition-all"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-400 hover:text-terracotta" />
                                                </button>
                                            )}
                                            {hasPermission(PERMISSIONS.DELETE_BLOG) && (
                                                <button 
                                                    onClick={() => handleDelete(post.id)}
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

            {/* Modal - Blog Form */}
            {showPostForm && (
                <div className="fixed inset-0 bg-dark-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-serif-elegant text-dark-brown">
                                    {editingPost ? 'Edit Blog Post' : 'Create New Post'}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                    Share your stories and insights with the community.
                                    <span className="inline-flex items-center gap-1 bg-olive-green/10 text-olive-green px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
                                        Auto-Translating enabled
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 mr-2">
                                    <input
                                        type="checkbox"
                                        checked={showArabic}
                                        onChange={(e) => setShowArabic(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-olive-green focus:ring-olive-green"
                                    />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Show Arabic Fields</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleTranslate}
                                    disabled={isTranslating}
                                    className="flex items-center gap-2 bg-olive-green/10 text-olive-green px-4 py-2 rounded-xl hover:bg-olive-green hover:text-white transition-all font-bold text-xs disabled:opacity-50"
                                >
                                    {isTranslating ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3" />
                                    )}
                                    <span>{isTranslating ? 'Preview Arabic' : 'Magic Translate'}</span>
                                </button>
                                <button
                                    onClick={() => setShowPostForm(false)}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-dark-brown"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Story Title (EN)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                            placeholder="e.g., The Secret to Perfect Tahdig"
                                        />
                                    </div>
                                    <div className={`md:col-span-1 ${!showArabic && 'hidden'}`}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Story Title (AR)</label>
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
                                            placeholder="A brief summary..."
                                        />
                                    </div>
                                    <div className={`md:col-span-1 ${!showArabic && 'hidden'}`}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Excerpt (AR)</label>
                                        <textarea
                                            value={formData.excerpt_ar}
                                            onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm text-right"
                                            dir="rtl"
                                            rows={2}
                                            placeholder="ملخص باللغة العربية..."
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
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Author Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                        >
                                            <option value="Culture">Culture</option>
                                            <option value="Ingredients">Ingredients</option>
                                            <option value="Stories">Stories</option>
                                            <option value="Techniques">Techniques</option>
                                            <option value="Traditions">Traditions</option>
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
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Read Time</label>
                                        <input
                                            type="text"
                                            value={formData.readTime}
                                            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                            placeholder="5 min read"
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
                                            placeholder="Tell the story in English..."
                                        />
                                    </div>
                                    <div className={`md:col-span-1 ${!showArabic && 'hidden'}`}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Content (AR)</label>
                                        <textarea
                                            rows={12}
                                            value={formData.content_ar}
                                            onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                                            className="w-full px-6 py-4 rounded-[24px] border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-medium text-dark-brown outline-none shadow-sm custom-scrollbar text-right"
                                            dir="rtl"
                                            placeholder="اكتب القصة بالعربية..."
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="hidden" id="blog-submit-btn" />
                            </form>
                        </div>

                        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/30">
                            <button
                                onClick={() => setShowPostForm(false)}
                                className="px-8 py-3 rounded-2xl border border-gray-200 hover:bg-white transition-all font-bold text-gray-500 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => document.getElementById('blog-submit-btn')?.click()}
                                className="px-10 py-3 bg-olive-green text-white rounded-2xl hover:bg-terracotta transition-all font-bold shadow-warm active:scale-95"
                            >
                                {editingPost ? 'Update Story' : 'Publish Story'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
