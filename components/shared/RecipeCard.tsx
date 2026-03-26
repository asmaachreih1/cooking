import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import { Recipe } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { t, isRTL, df } = useLanguage();
  return (
    <Link href={`/recipes/${recipe.id}`} className="recipe-card block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all">
        {/* Image */}
        <div className="relative h-56 img-hover-zoom">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-overlay" />

          {/* Category Badge */}
          <span className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} px-3 py-1 rounded-full text-xs font-medium ${recipe.category === 'lebanese' ? 'badge-lebanese' : 'badge-palestinian'
            }`}>
            {recipe.category === 'lebanese' ? t('common.lebanese') : t('common.palestinian')}
          </span>

          {/* Type Badge */}
          <span className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-white/90 text-dark-brown px-3 py-1 rounded-full text-xs font-medium capitalize`}>
            {recipe.type}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif-elegant text-xl font-semibold text-dark-brown mb-2 line-clamp-1">
            {df(recipe, 'title')}
          </h3>
          <p className={`text-dark-brown/70 text-sm mb-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
            {df(recipe, 'description')}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-dark-brown/60">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.prepTime}</span>
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="w-4 h-4" />
              <span>{recipe.servings} {t('common.servings')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
