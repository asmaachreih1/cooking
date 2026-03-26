import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { NewsItem } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const { t, language, isRTL, df } = useLanguage();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/news/${news.id}`} className="recipe-card block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/3 h-48 md:h-auto img-hover-zoom">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-3">
              <span className="bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-xs font-medium">
                {news.category}
              </span>
              <div className={`flex items-center gap-1 text-xs text-dark-brown/60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(news.date)}</span>
              </div>
            </div>

            <h3 className="font-serif-elegant text-xl font-semibold text-dark-brown mb-2">
              {df(news, 'title')}
            </h3>
            <p className={`text-dark-brown/70 text-sm mb-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
              {df(news, 'excerpt')}
            </p>

            <div className={`flex items-center text-olive-green font-medium text-sm group-hover:text-terracotta transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
              {t('common.readMore')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 group-hover:-translate-x-1' : 'ml-1 group-hover:translate-x-1'} transition-transform`} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
