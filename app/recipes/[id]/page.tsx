"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, ChefHat, Printer, Share2, Heart, MessageCircle, Lightbulb, BookOpen, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import RecipeCard from '@/components/shared/RecipeCard';
import QuestionSection from '@/components/shared/QuestionSection';

import { Recipe } from '@/types';

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { t, isRTL, df } = useLanguage();
    const { id } = use(params);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeAndRelated = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'recipes', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const recipeData = { id: docSnap.id, ...docSnap.data() } as Recipe;
                    setRecipe(recipeData);

                    // Fetch related recipes
                    const relatedQuery = query(
                        collection(db, 'recipes'),
                        where('category', '==', recipeData.category),
                        limit(4) // Fetch 4 to filter out current one
                    );
                    const relatedSnap = await getDocs(relatedQuery);
                    const relatedData = relatedSnap.docs
                        .map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
                        .filter(r => r.id !== id)
                        .slice(0, 3);
                    setRelatedRecipes(relatedData);
                }
            } catch (error) {
                console.error("Error fetching recipe: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeAndRelated();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
                <p className="text-dark-brown/60 font-serif-elegant text-xl">{t('recipeDetail.preparing')}</p>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
                <p className="text-dark-brown/60 font-serif-elegant text-xl">Recipe not found</p>
                <Link href="/recipes" className="text-olive-green hover:underline">
                    {t('recipeDetail.backToRecipes')}
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen">
            {/* Hero */}
            <section className="relative h-[40vh] md:h-[60vh] min-h-[350px] md:min-h-[500px]">
                <img
                    src={recipe.image}
                    alt={df(recipe, 'title')}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-brown via-dark-brown/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-cream">
                    <div className="container mx-auto">
                        <Link
                            href="/recipes"
                            className="inline-flex items-center gap-2 text-cream/80 hover:text-cream mb-4 transition-colors"
                        >
                            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                            {t('recipeDetail.backToRecipes')}
                        </Link>

                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className={`px-4 py-1 rounded-full text-sm font-medium ${recipe.category === 'lebanese' ? 'badge-lebanese' : 'badge-palestinian'
                                }`}>
                                {t(`recipes.${recipe.category}`)}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm capitalize">
                                {t(`recipes.${recipe.type}`)}
                            </span>
                            <span className={`px-4 py-1 rounded-full text-sm capitalize ${recipe.difficulty === 'easy' ? 'bg-olive-green' :
                                recipe.difficulty === 'medium' ? 'bg-terracotta' : 'bg-deep-red'
                                }`}>
                                {t(`recipes.${recipe.difficulty}`)}
                            </span>
                        </div>

                        <h1 className="font-serif-elegant text-5xl md:text-6xl mb-4">
                            {df(recipe, 'title')}
                        </h1>
                        <p className="text-cream/80 text-lg max-w-2xl">
                            {df(recipe, 'description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Recipe Info Bar */}
            <section className="bg-white shadow-soft sticky top-[73px] z-30">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-dark-brown">
                                <Clock className="w-5 h-5 text-olive-green" />
                                <div className="flex gap-1">
                                    <span className="text-sm text-dark-brown/60">{t('recipeDetail.prep')}: </span>
                                    <span className="font-medium">{recipe.prepTime}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-dark-brown">
                                <ChefHat className="w-5 h-5 text-terracotta" />
                                <div className="flex gap-1">
                                    <span className="text-sm text-dark-brown/60">{t('recipeDetail.cook')}: </span>
                                    <span className="font-medium">{recipe.cookTime}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-dark-brown">
                                <Users className="w-5 h-5 text-deep-red" />
                                <div className="flex gap-1">
                                    <span className="text-sm text-dark-brown/60">{t('recipeDetail.serves')}: </span>
                                    <span className="font-medium">{recipe.servings}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-full hover:bg-warm-beige transition-colors">
                                <Heart className="w-5 h-5 text-dark-brown" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-warm-beige transition-colors">
                                <Share2 className="w-5 h-5 text-dark-brown" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-warm-beige transition-colors">
                                <Printer className="w-5 h-5 text-dark-brown" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Ingredients */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-8 shadow-soft sticky top-[150px]">
                                <h2 className="font-serif-elegant text-2xl text-dark-brown mb-6 flex items-center gap-2">
                                    <span className={`w-8 h-8 ${recipe.category === 'palestinian' ? 'bg-terracotta/20' : 'bg-olive-green/20'} rounded-full flex items-center justify-center`}>
                                        <span className={`${recipe.category === 'palestinian' ? 'text-terracotta' : 'text-olive-green'} font-medium text-sm`}>✓</span>
                                    </span>
                                    {t('recipeDetail.ingredients')}
                                </h2>
                                <ul className="space-y-3">
                                    {df(recipe, 'ingredients').map((ingredient: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3 group">
                                            <input
                                                type="checkbox"
                                                className={`mt-1.5 w-4 h-4 rounded border-warm-beige text-olive-green focus:ring-olive-green ${isRTL ? 'ml-0 mr-1.5' : ''}`}
                                            />
                                            <span className={`text-dark-brown/80 group-hover:text-dark-brown transition-colors ${isRTL ? 'text-right' : 'text-left'}`}>
                                                {ingredient}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Story Section */}
                            <div className={`${recipe.category === 'palestinian' ? 'story-box-red' : 'story-box'} p-6 rounded-2xl`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 ${recipe.category === 'palestinian' ? 'bg-terracotta/20' : 'bg-olive-green/20'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <BookOpen className={`w-6 h-6 ${recipe.category === 'palestinian' ? 'text-terracotta' : 'text-olive-green'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif-elegant text-xl text-dark-brown mb-2">
                                            {t('recipeDetail.storyHeading')}
                                        </h3>
                                        <p className="text-dark-brown/80 italic">
                                            {df(recipe, 'story')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div>
                                <h2 className="font-serif-elegant text-2xl text-dark-brown mb-6">
                                    {t('recipeDetail.instructions')}
                                </h2>
                                <ol className="space-y-6">
                                    {df(recipe, 'instructions').map((instruction: string, index: number) => (
                                        <li key={index} className="flex gap-4">
                                            <div className={`w-10 h-10 ${recipe.category === 'palestinian' ? 'bg-terracotta' : 'bg-olive-green'} text-white rounded-full flex items-center justify-center flex-shrink-0 font-serif-elegant`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 pt-2">
                                                <p className="text-dark-brown/80">{instruction}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Tips from Mom */}
                            <div className="tips-box p-6 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-terracotta/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Lightbulb className="w-6 h-6 text-terracotta" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif-elegant text-xl text-dark-brown mb-2">
                                            {t('recipeDetail.tipsFromMom')}
                                        </h3>
                                        <p className="text-dark-brown/80">
                                            {df(recipe, 'tips')}
                                        </p>
                                    </div>
                                </div>
                            </div>


                            <div id="questions">
                                <QuestionSection recipeId={recipe.id} category={recipe.category as any} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Recipes */}
            {relatedRecipes.length > 0 && (
                <section className="py-12 bg-warm-beige/30">
                    <div className="container mx-auto px-4">
                        <h2 className="font-serif-elegant text-3xl text-dark-brown mb-10 text-center">
                            {t('recipeDetail.moreRecipes').replace('{category}', t(`recipes.${recipe.category}`))}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedRecipes.map((r) => (
                                <RecipeCard key={r.id} recipe={r} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
