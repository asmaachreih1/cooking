"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import RecipeCard from '@/components/shared/RecipeCard';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Recipe } from '@/types';

const RecipesPage = () => {
    const { t, isRTL, df } = useLanguage();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cuisineFilter, setCuisineFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
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
        fetchRecipes();
    }, []);

    const filteredRecipes = useMemo(() => {
        return recipes.filter((recipe) => {
            const title = (recipe?.title || '').toLowerCase();
            const title_ar = (recipe?.title_ar || '').toLowerCase();
            const description = (recipe?.description || '').toLowerCase();
            const description_ar = (recipe?.description_ar || '').toLowerCase();
            const search = searchTerm.toLowerCase();

            const matchesSearch = 
                title.includes(search) || 
                title_ar.includes(search) || 
                description.includes(search) || 
                description_ar.includes(search);
            
            const matchesCuisine = cuisineFilter === 'all' || 
                                 recipe.category?.toLowerCase() === cuisineFilter.toLowerCase();
            
            const matchesType = typeFilter === 'all' || 
                               recipe.type?.toLowerCase() === typeFilter.toLowerCase();
            
            return matchesSearch && matchesCuisine && matchesType;
        });
    }, [recipes, searchTerm, cuisineFilter, typeFilter]);

    const types = ['all', 'main', 'appetizer', 'dessert', 'salad', 'soup', 'beverage'];

    const clearFilters = () => {
        setSearchTerm('');
        setCuisineFilter('all');
        setTypeFilter('all');
    };

    const hasActiveFilters = searchTerm || cuisineFilter !== 'all' || typeFilter !== 'all';

    return (
        <div className="bg-cream min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-dark-brown/60 z-10" />
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(https://urbanfarmandkitchen.com/wp-content/uploads/2023/04/levantine-cuisine.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 tatreez-pattern opacity-10 z-10" />

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <span className="text-light-olive font-medium mb-3 block text-sm tracking-widest uppercase">{t('recipes.ourCollection')}</span>
                    <h1 className="font-serif-elegant text-4xl md:text-7xl mb-6 text-cream">
                        {t('recipes.traditionalRecipes')}
                    </h1>
                    <p className="text-cream/80 max-w-2xl mx-auto text-xl font-light">
                        {t('recipes.heroDesc')}
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="sticky top-[73px] z-40 bg-cream/95 backdrop-blur-sm shadow-soft border-b border-warm-beige/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-dark-brown/40`} />
                            <input
                                type="text"
                                placeholder={t('recipes.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-full border border-warm-beige bg-white focus:border-olive-green focus:ring-2 focus:ring-olive-green/20 transition-all text-xs md:text-sm`}
                            />
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Cuisine Filter */}
                            <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-warm-beige shadow-sm">
                                <button
                                    onClick={() => setCuisineFilter('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cuisineFilter === 'all' ? 'bg-olive-green text-white' : 'text-dark-brown hover:bg-warm-beige'
                                        }`}
                                >
                                    {t('recipes.all')}
                                </button>
                                <button
                                    onClick={() => setCuisineFilter('palestinian')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cuisineFilter === 'palestinian' ? 'bg-olive-green text-white' : 'text-dark-brown hover:bg-warm-beige'
                                        }`}
                                >
                                    {t('recipes.palestinian')}
                                </button>
                                <button
                                    onClick={() => setCuisineFilter('lebanese')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cuisineFilter === 'lebanese' ? 'bg-deep-red text-white' : 'text-dark-brown hover:bg-warm-beige'
                                        }`}
                                >
                                    {t('recipes.lebanese')}
                                </button>
                            </div>

                            {/* Type Filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-6 py-3 rounded-full border border-warm-beige bg-white text-dark-brown focus:border-olive-green transition-colors capitalize text-sm font-medium cursor-pointer shadow-sm"
                            >
                                {types.map((type) => (
                                    <option key={type} value={type} className="capitalize">
                                        {type === 'all' ? t('recipes.allTypes') : t(`recipes.${type}`)}
                                    </option>
                                ))}
                            </select>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 text-terracotta hover:text-deep-red transition-colors text-sm font-medium"
                                >
                                    <X className="w-4 h-4" />
                                    {t('recipes.clear')}
                                </button>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-olive-green text-white rounded-full shadow-md"
                        >
                            <Filter className="w-4 h-4" />
                            {t('recipes.filters')}
                            {hasActiveFilters && (
                                <span className="w-5 h-5 bg-terracotta rounded-full text-[10px] flex items-center justify-center font-bold">
                                    !
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Filters Dropdown */}
                    {showFilters && (
                        <div className="lg:hidden mt-4 p-6 bg-white rounded-3xl shadow-warm border border-warm-beige/30 space-y-6 text-left">
                            <div>
                                <label className={`text-sm font-semibold text-dark-brown mb-3 block ${isRTL ? 'text-right' : 'text-left'}`}>{t('recipes.cuisine')}</label>
                                <div className="flex gap-2">
                                    {['all', 'palestinian', 'lebanese'].map((cuisine) => (
                                        <button
                                            key={cuisine}
                                            onClick={() => setCuisineFilter(cuisine)}
                                            className={`flex-1 px-3 py-3 rounded-xl text-xs font-semibold transition-all capitalize ${cuisineFilter === cuisine
                                                ? cuisine === 'lebanese'
                                                    ? 'bg-deep-red text-white'
                                                    : 'bg-olive-green text-white'
                                                : 'bg-cream text-dark-brown border border-warm-beige/50'
                                                }`}
                                        >
                                            {t(`recipes.${cuisine}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={`text-sm font-semibold text-dark-brown mb-3 block ${isRTL ? 'text-right' : 'text-left'}`}>{t('recipes.type')}</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full px-4 py-4 rounded-xl border border-warm-beige bg-cream focus:border-olive-green transition-colors capitalize text-sm"
                                >
                                    {types.map((type) => (
                                        <option key={type} value={type} className="capitalize">
                                            {type === 'all' ? t('recipes.allTypes') : t(`recipes.${type}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-3 text-terracotta font-bold text-sm border border-terracotta/20 rounded-xl bg-terracotta/5"
                                >
                                    {t('recipes.clearAll')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Results */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {/* Results Count */}
                    <div className="mb-8">
                        <p className={`text-dark-brown/60 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('recipes.showing')} <span className="font-bold text-dark-brown">{filteredRecipes.length}</span> {t('recipes.recipesCount')}
                            {hasActiveFilters && ` ${t('recipes.matchingSearch')}`}
                        </p>
                    </div>

                    {/* Recipe Grid */}
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-olive-green animate-spin" />
                            <p className="text-dark-brown/60 font-medium">{t('recipes.gathering')}</p>
                        </div>
                    ) : filteredRecipes.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRecipes.map((recipe: Recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-soft border border-warm-beige/20">
                            <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-dark-brown/20" />
                            </div>
                            <h3 className="font-serif-elegant text-2xl text-dark-brown mb-2">
                                {t('recipes.noRecipesFound')}
                            </h3>
                            <p className="text-dark-brown/60 mb-8 max-w-xs mx-auto text-sm">
                                {t('recipes.noRecipesDesc')}
                            </p>
                            <button
                                onClick={clearFilters}
                                className="bg-olive-green text-white px-8 py-3 rounded-full font-medium hover:bg-terracotta transition-all shadow-md"
                            >
                                {t('recipes.clearAll')}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RecipesPage;
