"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, ArrowRight, Heart, BookOpen, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import RecipeCard from '@/components/shared/RecipeCard';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { Recipe } from '@/types';

export default function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [recipeOfWeek, setRecipeOfWeek] = useState<Recipe | null>(null);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t, isRTL, df } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch Featured Recipes
        const featuredQuery = query(collection(db, 'recipes'), where('featured', '==', true), limit(3));
        const featuredSnap = await getDocs(featuredQuery);
        setFeaturedRecipes(featuredSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe)));

        // Fetch Recipe of the Week
        const weekQuery = query(collection(db, 'recipes'), where('recipeOfWeek', '==', true), limit(1));
        const weekSnap = await getDocs(weekQuery);
        if (!weekSnap.empty) {
          setRecipeOfWeek({ id: weekSnap.docs[0].id, ...weekSnap.docs[0].data() } as Recipe);
        }

        // Fetch Total Count (Simplified for now)
        const allRecipesSnap = await getDocs(collection(db, 'recipes'));
        setTotalRecipes(allRecipesSnap.size);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    if (user) {
      fetchHomeData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-olive-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center tatreez-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-brown/80 via-dark-brown/60 to-transparent z-0" />
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://domesticfits.com/wp-content/uploads/2023/05/lebanese-food-scaled.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-olive-green/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4 text-deep-red fill-deep-red" />
              <span className="text-cream text-sm">{t('common.madeWithLove')}</span>
            </div>

            <h1 className="font-handwritten text-6xl md:text-8xl text-cream mb-4">
              {t('common.heroTitle')}
            </h1>
            <p className="font-serif-elegant text-2xl md:text-3xl text-cream/90 mb-6">
              {t('common.heroSubtitle')}
            </p>
            <p className="text-cream/70 text-lg mb-8 max-w-lg">
              {t('common.heroDescription')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/recipes"
                className="bg-olive-green text-white px-8 py-4 rounded-full font-medium hover:bg-terracotta transition-all hover:shadow-warm flex items-center gap-2"
              >
                {t('common.exploreRecipes')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                href="/about"
                className="border-2 border-cream text-cream px-8 py-4 rounded-full font-medium hover:bg-cream hover:text-dark-brown transition-all flex items-center gap-2"
              >
                {t('common.readOurStory')}
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-cream relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-olive-green font-medium mb-2 block">{t('common.ourHeritage')}</span>
              <h2 className="font-serif-elegant text-4xl md:text-5xl text-dark-brown mb-6">
                {t('common.everyMealMemory')}
              </h2>
              <div className="space-y-4 text-dark-brown/70">
                <p>
                  {t('home.heritageText1')}
                </p>
                <p>
                  {t('home.heritageText2')}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-8">
                <div>
                  <span className="font-serif-elegant text-4xl text-olive-green">{totalRecipes || 20}+</span>
                  <p className="text-dark-brown/60 text-sm">{t('home.familyRecipes')}</p>
                </div>
                <div>
                  <span className="font-serif-elegant text-4xl text-terracotta">3</span>
                  <p className="text-dark-brown/60 text-sm">{t('home.generations')}</p>
                </div>
                <div>
                  <span className="font-serif-elegant text-4xl text-deep-red">∞</span>
                  <p className="text-dark-brown/60 text-sm">{t('home.love')}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-warm">
                <img
                  src="https://static01.nyt.com/images/2023/02/16/multimedia/16grandmas3-bgzl/16grandmas3-bgzl-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
                  alt="Family cooking"
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-4 md:p-6 rounded-2xl shadow-medium max-w-[200px] md:max-w-xs transition-all">
                <p className="font-handwritten text-xl md:text-2xl text-terracotta mb-2">"{t('home.quote')}"</p>
                <p className="text-dark-brown/60 text-xs md:text-sm">- Mama Montaha</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe of the Week */}
      {recipeOfWeek && (
        <section className="py-20 bg-warm-beige tatreez-pattern-red relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-terracotta font-medium mb-2">
                <Sparkles className="w-4 h-4" />
                {t('home.specialThisWeek')}
              </span>
              <h2 className="font-serif-elegant text-4xl text-dark-brown">{t('common.recipeOfTheWeek')}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-warm img-hover-zoom">
                <img
                  src={recipeOfWeek.image}
                  alt={recipeOfWeek.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
              <div>
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${recipeOfWeek.category === 'lebanese' ? 'badge-lebanese' : 'badge-palestinian'
                  }`}>
                  {recipeOfWeek.category === 'lebanese' ? t('common.lebanese') : t('common.palestinian')}
                </span>
                <h3 className="font-serif-elegant text-4xl text-dark-brown mb-4">
                  {df(recipeOfWeek, 'title')}
                </h3>
                <p className="text-dark-brown/70 mb-6">
                  {df(recipeOfWeek, 'description')}
                </p>
                <div className="story-box-red p-4 rounded-xl mb-6">
                  <p className="text-dark-brown/80 italic text-sm">
                    "{df(recipeOfWeek, 'story').substring(0, 150)}..."
                  </p>
                </div>
                <Link
                  href={`/recipes/${recipeOfWeek.id}`}
                  className={`inline-flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-olive-green transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {t('common.viewRecipe')}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Recipes */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-olive-green font-medium mb-2 block">{t('home.fromOurKitchen')}</span>
              <h2 className="font-serif-elegant text-4xl text-dark-brown">{t('common.featuredRecipes')}</h2>
            </div>
            <Link
              href="/recipes"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-terracotta font-medium hover:text-olive-green transition-colors"
            >
              {t('common.viewAll')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.slice(0, 3).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-dark-brown text-cream relative overflow-hidden">
        <div className="absolute inset-0 tatreez-pattern opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-light-olive font-medium mb-2 block">{t('home.whatWeOffer')}</span>
            <h2 className="font-serif-elegant text-4xl">{t('home.shareExperience')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: t('home.service1Title'),
                description: t('home.service1Desc')
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: t('home.service2Title'),
                description: t('home.service2Desc')
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: t('home.service3Title'),
                description: t('home.service3Desc')
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-cream/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-cream/20 transition-colors"
              >
                <div className="w-16 h-16 bg-olive-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="font-serif-elegant text-xl mb-3">{service.title}</h3>
                <p className="text-cream/70 text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-full font-medium hover:bg-olive-green transition-colors"
            >
              {t('home.exploreServices')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-olive-green to-light-olive rounded-3xl p-6 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 tatreez-pattern opacity-10" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-serif-elegant text-4xl mb-4">
                {t('home.joinJourney')}
              </h2>
              <p className="text-white/80 mb-8">
                {t('home.subscribeDesc')}
              </p>
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-full p-1.5 flex flex-col sm:flex-row items-center shadow-lg">
                  <input
                    type="email"
                    placeholder={t('home.emailPlaceholder')}
                    className="w-full sm:flex-1 bg-transparent px-6 py-3 text-dark-brown focus:outline-none placeholder:text-dark-brown/40"
                  />
                  <button className="w-full sm:w-auto bg-dark-brown text-white px-8 py-3 rounded-full font-medium hover:bg-terracotta transition-colors shadow-md">
                    {t('home.subscribe')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
