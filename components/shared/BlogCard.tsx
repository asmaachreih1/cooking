import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { BlogPost } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const { language, isRTL, df } = useLanguage();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.id}`} className="recipe-card block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow h-full">
        {/* Image */}
        <div className="h-48 img-hover-zoom">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <span className="inline-block bg-olive-green/10 text-olive-green px-3 py-1 rounded-full text-xs font-medium mb-3">
            {post.category}
          </span>

          <h3 className="font-serif-elegant text-xl font-semibold text-dark-brown mb-2 line-clamp-2">
            {df(post, 'title')}
          </h3>
          <p className={`text-dark-brown/70 text-sm mb-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
            {df(post, 'excerpt')}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-dark-brown/60">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{post.author}</span>
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
