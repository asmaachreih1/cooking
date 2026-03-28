"use client";

import { useEffect, useState } from 'react';
import {
    ChefHat, Plus, Edit, Trash2, Eye, Filter, Search, XCircle, Image as ImageIcon, Loader2, Sparkles
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Recipe, PERMISSIONS } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { translateFields } from '@/lib/translate-client';

export default function RecipesManagement() {
    const { hasPermission } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRecipeForm, setShowRecipeForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [formData, setFormData] = useState<Partial<Recipe>>({
        title: '',
        title_ar: '',
        description: '',
        description_ar: '',
        image: '',
        category: 'lebanese',
        type: 'main',
        prepTime: '',
        cookTime: '',
        servings: '',
        difficulty: 'medium',
        ingredients: [],
        ingredients_ar: [],
        instructions: [],
        instructions_ar: [],
        tips: '',
        tips_ar: '',
        story: '',
        story_ar: ''
    });
    const [isTranslating, setIsTranslating] = useState(false);
    const [showArabic, setShowArabic] = useState(false);

    const handleTranslate = async () => {
        if (!formData.title) {
            alert('Please enter at least the English title to translate.');
            return;
        }

        setIsTranslating(true);
        try {
            const fieldsToTranslate = {
                title: formData.title,
                description: formData.description,
                ingredients: formData.ingredients,
                instructions: formData.instructions,
                tips: formData.tips,
                story: formData.story
            };

            const translated = await translateFields(fieldsToTranslate);
            if (translated) {
                setFormData(prev => ({
                    ...prev,
                    title_ar: translated.title || prev.title_ar,
                    description_ar: translated.description || prev.description_ar,
                    ingredients_ar: translated.ingredients || prev.ingredients_ar,
                    instructions_ar: translated.instructions || prev.instructions_ar,
                    tips_ar: translated.tips || prev.tips_ar,
                    story_ar: translated.story || prev.story_ar
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
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'recipes'), orderBy('title'));
            const querySnapshot = await getDocs(q);
            const recipeData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Recipe[];
            setRecipes(recipeData);
        } catch (error) {
            console.error("Error fetching recipes: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this heritage recipe?')) {
            try {
                await deleteDoc(doc(db, 'recipes', id));
                setRecipes(prev => prev.filter(r => r.id !== id));
            } catch (error) {
                console.error("Error deleting recipe: ", error);
            }
        }
    };

    const handleEdit = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        // Ensure all bilingual fields are initialized even if they don't exist in the recipe object yet
        setFormData({
            ...recipe,
            title_ar: recipe.title_ar || '',
            description_ar: recipe.description_ar || '',
            ingredients_ar: recipe.ingredients_ar || [],
            instructions_ar: recipe.instructions_ar || [],
            tips_ar: recipe.tips_ar || '',
            story_ar: recipe.story_ar || ''
        });
        setShowRecipeForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalData = { ...formData };
            
            // Auto-translate if Arabic fields are empty
            const needsTranslation = !finalData.title_ar || !finalData.description_ar || 
                                   (finalData.ingredients_ar && finalData.ingredients_ar.length === 0) ||
                                   (finalData.instructions_ar && finalData.instructions_ar.length === 0);
            
            if (needsTranslation && finalData.title) {
                const translated = await translateFields({
                    title: finalData.title,
                    description: finalData.description,
                    ingredients: finalData.ingredients,
                    instructions: finalData.instructions,
                    tips: finalData.tips,
                    story: finalData.story
                });
                
                if (translated) {
                    finalData = {
                        ...finalData,
                        title_ar: finalData.title_ar || translated.title,
                        description_ar: finalData.description_ar || translated.description,
                        ingredients_ar: (finalData.ingredients_ar && finalData.ingredients_ar.length > 0) ? finalData.ingredients_ar : translated.ingredients,
                        instructions_ar: (finalData.instructions_ar && finalData.instructions_ar.length > 0) ? finalData.instructions_ar : translated.instructions,
                        tips_ar: finalData.tips_ar || translated.tips,
                        story_ar: finalData.story_ar || translated.story
                    };
                }
            }

            if (editingRecipe) {
                const recipeRef = doc(db, 'recipes', editingRecipe.id);
                await updateDoc(recipeRef, finalData);
            } else {
                await addDoc(collection(db, 'recipes'), finalData);
            }
            setShowRecipeForm(false);
            setEditingRecipe(null);
            setFormData({
                title: '',
                title_ar: '',
                description: '',
                description_ar: '',
                image: '',
                category: 'lebanese',
                type: 'main',
                prepTime: '',
                cookTime: '',
                servings: '',
                difficulty: 'medium',
                ingredients: [],
                ingredients_ar: [],
                instructions: [],
                instructions_ar: [],
                tips: '',
                tips_ar: '',
                story: '',
                story_ar: ''
            });
            fetchRecipes();
        } catch (error) {
            console.error("Error saving recipe: ", error);
        }
    };

    const filteredRecipes = recipes.filter(r => {
        const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
        const matchesType = filterType === 'all' || r.type === filterType;
        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-bold" />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all outline-none font-medium text-sm shadow-soft"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 transition-all font-bold text-xs text-dark-brown shadow-soft outline-none focus:ring-2 focus:ring-olive-green/20"
                    >
                        <option value="all">All Cultures</option>
                        <option value="lebanese">Lebanese</option>
                        <option value="palestinian">Palestinian</option>
                    </select>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 transition-all font-bold text-xs text-dark-brown shadow-soft outline-none focus:ring-2 focus:ring-olive-green/20"
                    >
                        <option value="all">All Types</option>
                        <option value="main">Main Course</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="dessert">Dessert</option>
                        <option value="salad">Salad</option>
                    </select>
                    {hasPermission(PERMISSIONS.CREATE_RECIPE) && (
                        <button
                            onClick={() => setShowRecipeForm(true)}
                            className="flex items-center gap-2 bg-olive-green text-white px-8 py-3 rounded-2xl hover:bg-terracotta transition-all font-bold text-sm shadow-warm active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Recipe</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[32px] shadow-soft border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recipe</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-olive-green animate-spin" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Heritage Treasures...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRecipes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No heritage recipes found</p>
                                    </td>
                                </tr>
                            ) : filteredRecipes.map((recipe) => (
                                <tr key={recipe.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 flex-shrink-0">
                                                <img
                                                    src={recipe.image}
                                                    alt={recipe.title}
                                                    className="w-full h-full rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-dark-brown text-sm mb-1 truncate">{recipe.title}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{recipe.prepTime} • {recipe.cookTime}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${recipe.category === 'lebanese'
                                                ? 'bg-deep-red/10 text-deep-red'
                                                : 'bg-olive-green/10 text-olive-green'
                                            }`}>
                                            {recipe.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-gray-500 font-bold text-xs capitalize">{recipe.type}</td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                recipe.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {recipe.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 hover:bg-white hover:shadow-soft rounded-xl transition-all">
                                                <Eye className="w-4 h-4 text-gray-400 hover:text-olive-green" />
                                            </button>
                                            {hasPermission(PERMISSIONS.EDIT_RECIPE) && (
                                                <button 
                                                    onClick={() => handleEdit(recipe)}
                                                    className="p-2.5 hover:bg-white hover:shadow-soft rounded-xl transition-all"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-400 hover:text-terracotta" />
                                                </button>
                                            )}
                                            {hasPermission(PERMISSIONS.DELETE_RECIPE) && (
                                                <button 
                                                    onClick={() => handleDelete(recipe.id)}
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

            {/* Modal - Recipe Form */}
            {showRecipeForm && (
                <div className="fixed inset-0 bg-dark-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-serif-elegant text-dark-brown">
                                    {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                    Capture the essence of our family heritage.
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
                                    onClick={() => setShowRecipeForm(false)}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-dark-brown"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Recipe Cover Photo</label>
                                    <div className="border-4 border-dashed border-gray-50 rounded-[32px] p-12 text-center hover:border-olive-green/30 transition-all cursor-pointer group">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-olive-green" />
                                        </div>
                                        <p className="text-gray-500 font-bold mb-1">Drag and drop an image here</p>
                                        <p className="text-xs text-gray-400">or <span className="text-olive-green underline">browse your files</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Recipe Title (EN)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                            placeholder="e.g., Mom's Authentic Musakhan"
                                        />
                                    </div>
                                    <div className={`md:col-span-1 ${!showArabic && 'hidden'}`}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Recipe Title (AR)</label>
                                        <input
                                            type="text"
                                            value={formData.title_ar}
                                            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm text-right"
                                            dir="rtl"
                                            placeholder="مثلاً: مسخن أمي الأصيل"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description (EN)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                            rows={2}
                                            placeholder="Short description..."
                                        />
                                    </div>
                                    <div className={`md:col-span-1 ${!showArabic && 'hidden'}`}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description (AR)</label>
                                        <textarea
                                            value={formData.description_ar}
                                            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm text-right"
                                            dir="rtl"
                                            rows={2}
                                            placeholder="وصف قصير..."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
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
                                            <option value="lebanese">Lebanese Heritage</option>
                                            <option value="palestinian">Palestinian Heritage</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Meal Type</label>
                                        <select 
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                        >
                                            <option value="main">Main Course</option>
                                            <option value="appetizer">Appetizer / Mezze</option>
                                            <option value="dessert">Sweets & Desserts</option>
                                            <option value="salad">Fresh Salads</option>
                                            <option value="beverage">Traditional Beverage</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Prep Time</label>
                                        <input 
                                            type="text" 
                                            value={formData.prepTime}
                                            onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-dark-brown outline-none" 
                                            placeholder="20 mins" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cook Time</label>
                                        <input 
                                            type="text" 
                                            value={formData.cookTime}
                                            onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-dark-brown outline-none" 
                                            placeholder="45 mins" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Servings</label>
                                        <input 
                                            type="text" 
                                            value={formData.servings}
                                            onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-dark-brown outline-none" 
                                            placeholder="4-6 people" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Difficulty</label>
                                        <select 
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 font-bold text-dark-brown outline-none shadow-sm"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ingredients (EN)</label>
                                            <textarea
                                                rows={4}
                                                value={Array.isArray(formData.ingredients) ? formData.ingredients.join('\n') : ''}
                                                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value.split('\n') })}
                                                className="w-full px-6 py-4 rounded-[24px] border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                                placeholder="One ingredient per line..."
                                            />
                                        </div>
                                        <div className={!showArabic ? 'hidden' : ''}>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ingredients (AR)</label>
                                            <textarea
                                                rows={4}
                                                value={Array.isArray(formData.ingredients_ar) ? formData.ingredients_ar.join('\n') : ''}
                                                onChange={(e) => setFormData({ ...formData, ingredients_ar: e.target.value.split('\n') })}
                                                className="w-full px-6 py-4 rounded-[24px] border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm text-right"
                                                dir="rtl"
                                                placeholder="مكون واحد في كل سطر..."
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Instructions (EN)</label>
                                            <textarea
                                                rows={6}
                                                value={Array.isArray(formData.instructions) ? formData.instructions.join('\n') : ''}
                                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value.split('\n') })}
                                                className="w-full px-6 py-4 rounded-[24px] border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm"
                                                placeholder="Describe the method..."
                                            />
                                        </div>
                                        <div className={!showArabic ? 'hidden' : ''}>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Instructions (AR)</label>
                                            <textarea
                                                rows={6}
                                                value={Array.isArray(formData.instructions_ar) ? formData.instructions_ar.join('\n') : ''}
                                                onChange={(e) => setFormData({ ...formData, instructions_ar: e.target.value.split('\n') })}
                                                className="w-full px-6 py-4 rounded-[24px] border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all font-bold text-dark-brown outline-none shadow-sm text-right"
                                                dir="rtl"
                                                placeholder="صف الطريقة..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-olive-green uppercase tracking-widest mb-2">Story (EN)</label>
                                            <textarea
                                                rows={4}
                                                value={formData.story}
                                                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                                className="w-full px-6 py-4 rounded-[24px] border-2 border-olive-green/10 bg-olive-green/5 focus:bg-white focus:border-olive-green transition-all font-medium italic text-dark-brown outline-none shadow-sm"
                                                placeholder="Story in English..."
                                            />
                                        </div>
                                        <div className={!showArabic ? 'hidden' : ''}>
                                            <label className="block text-[10px] font-bold text-olive-green uppercase tracking-widest mb-2">Story (AR)</label>
                                            <textarea
                                                rows={4}
                                                value={formData.story_ar}
                                                onChange={(e) => setFormData({ ...formData, story_ar: e.target.value })}
                                                className="w-full px-6 py-4 rounded-[24px] border-2 border-olive-green/10 bg-olive-green/5 focus:bg-white focus:border-olive-green transition-all font-medium italic text-dark-brown outline-none shadow-sm text-right"
                                                dir="rtl"
                                                placeholder="القصة بالعربية..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-terracotta uppercase tracking-widest mb-2">Tips (EN)</label>
                                            <textarea
                                                rows={4}
                                                value={formData.tips}
                                                onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                                                className="w-full px-6 py-4 rounded-[24px] border-2 border-terracotta/10 bg-terracotta/5 focus:bg-white focus:border-terracotta transition-all font-medium text-dark-brown outline-none shadow-sm"
                                                placeholder="Tips in English..."
                                            />
                                        </div>
                                        <div className={!showArabic ? 'hidden' : ''}>
                                            <label className="block text-[10px] font-bold text-terracotta uppercase tracking-widest mb-2">Tips (AR)</label>
                                            <textarea
                                                rows={4}
                                                value={formData.tips_ar}
                                                onChange={(e) => setFormData({ ...formData, tips_ar: e.target.value })}
                                                className="w-full px-6 py-4 rounded-[24px] border-2 border-terracotta/10 bg-terracotta/5 focus:bg-white focus:border-terracotta transition-all font-medium text-dark-brown outline-none shadow-sm text-right"
                                                dir="rtl"
                                                placeholder="نصائح بالعربية..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-olive-green focus:ring-olive-green" 
                                        />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-olive-green transition-colors">Featured Recipe</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.recipeOfWeek}
                                            onChange={(e) => setFormData({ ...formData, recipeOfWeek: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-terracotta focus:ring-terracotta" 
                                        />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-terracotta transition-colors">Recipe of the Week</span>
                                    </label>
                                </div>
                                <button type="submit" className="hidden" id="recipe-submit-btn" />
                            </form>
                        </div>

                        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/30">
                            <button
                                onClick={() => {
                                    setShowRecipeForm(false);
                                    setEditingRecipe(null);
                                }}
                                className="px-8 py-3 rounded-2xl border border-gray-200 hover:bg-white transition-all font-bold text-gray-500 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => document.getElementById('recipe-submit-btn')?.click()}
                                className="px-10 py-3 bg-olive-green text-white rounded-2xl hover:bg-terracotta transition-all font-bold shadow-warm active:scale-95"
                            >
                                {editingRecipe ? 'Update Heritage Recipe' : 'Publish Heritage Recipe'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
