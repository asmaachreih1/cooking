"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, Send, Reply as ReplyIcon, User } from 'lucide-react';
import { submitQuestion, submitReply, getQuestions } from '@/app/actions/recipe-actions';
import { useLanguage } from '@/context/LanguageContext';

interface QuestionSectionProps {
    recipeId: string;
    category?: 'lebanese' | 'palestinian';
}

export default function QuestionSection({ recipeId, category }: QuestionSectionProps) {
    const { t, isRTL } = useLanguage();
    const [questions, setQuestions] = useState<any[]>([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [recipeId]);

    const fetchQuestions = async () => {
        const data = await getQuestions(recipeId);
        setQuestions(data);
    };

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;
        setIsSubmitting(true);
        const res = await submitQuestion(recipeId, newQuestion);
        if (res.success) {
            setNewQuestion('');
            fetchQuestions();
        }
        setIsSubmitting(false);
    };

    const handleReplySubmit = async (commentId: string) => {
        if (!replyContent.trim()) return;
        setIsSubmitting(true);
        const res = await submitReply(commentId, replyContent, recipeId);
        if (res.success) {
            setReplyContent('');
            setReplyingTo(null);
            fetchQuestions();
        }
        setIsSubmitting(false);
    };

    const totalComments = questions.length + questions.reduce((acc, q) => acc + (q.replies?.length || 0), 0);

    return (
        <section className="mt-16 bg-white rounded-3xl p-4 md:p-8 shadow-soft border border-warm-beige/20 border-tatreez-top">
            <div className={`inline-flex items-center gap-2 border-2 ${category === 'palestinian' ? 'border-terracotta text-terracotta' : 'border-olive-green text-olive-green'} px-6 py-2 rounded-full font-serif-elegant text-xl mb-8`}>
                <MessageCircle className="w-5 h-5" />
                {t('questionSection.askQuestion')}
            </div>

            {/* Question Form - Always Visible */}
            <form onSubmit={handleQuestionSubmit} className="mb-12">
                <div className="relative">
                    <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder={t('questionSection.placeholder')}
                        className={`w-full p-6 rounded-2xl bg-cream/30 border border-warm-beige focus:border-olive-green focus:ring-2 focus:ring-olive-green/10 transition-all font-light text-dark-brown resize-none h-32 ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`absolute bottom-4 ${isRTL ? 'left-4' : 'right-4'} bg-olive-green text-white px-6 py-2 rounded-full font-medium hover:bg-terracotta transition-colors flex items-center gap-2 shadow-warm disabled:opacity-50`}
                    >
                        {t('questionSection.ask')}
                        <Send className={`w-4 h-4 ${isRTL ? 'scale-x-[-1]' : ''}`} />
                    </button>
                </div>
                <p className={`text-xs text-dark-brown/40 mt-3 flex items-center gap-1 italic ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <User className="w-3 h-3" />
                    {t('questionSection.anonymous')}
                </p>
            </form>

            {/* Comments Toggle */}
            <div className="border-t border-warm-beige/20 pt-8">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-2 text-dark-brown/60 hover:text-olive-green transition-colors text-sm font-medium mb-6 group ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                    <MessageCircle className="w-4 h-4" />
                    {isExpanded ? t('questionSection.hideDiscussion') : t('questionSection.viewDiscussion').replace('{count}', totalComments.toString())}
                    <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>↓</span>
                </button>

                {isExpanded && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        {questions.length === 0 ? (
                            <div className="text-center py-12 bg-cream/10 rounded-3xl border-2 border-dashed border-warm-beige/30 text-dark-brown/40">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p>{t('questionSection.noQuestions')}</p>
                            </div>
                        ) : (
                            questions.map((q) => (
                                <div key={q.id} className="group border-b border-warm-beige/10 pb-4 last:border-0 last:pb-0">
                                    <div className="flex gap-4 items-start mb-4">
                                        <div className={`w-10 h-10 bg-olive-green/10 text-olive-green rounded-full flex items-center justify-center flex-shrink-0 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-serif-elegant font-bold text-dark-brown">{q.author === 'Mom' ? t('questionSection.momAuthor') : q.author}</span>
                                                <span className="text-xs text-dark-brown/30">{new Date(q.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                                            </div>
                                            <p className={`text-dark-brown/80 leading-relaxed font-light ${isRTL ? 'text-right' : 'text-left'}`}>{q.content}</p>

                                            <button
                                                onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                                                className={`text-xs text-olive-green hover:text-terracotta uppercase tracking-wider font-bold mt-4 flex items-center gap-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                                            >
                                                <ReplyIcon className={`w-3 h-3 ${isRTL ? 'scale-x-[-1]' : ''}`} />
                                                {t('questionSection.reply')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Replies */}
                                    <div className={`${isRTL ? 'mr-14' : 'ml-14'} space-y-4 mt-4`}>
                                        {q.replies && q.replies.map((r: any) => (
                                            <div key={r.id} className={`flex gap-3 items-start bg-cream/20 p-4 rounded-2xl border-l-4 border-olive-green ${isRTL ? 'flex-row-reverse border-l-0 border-r-4' : ''}`}>
                                                <div className="w-8 h-8 bg-olive-green text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-serif-elegant">
                                                    {r.author === 'Mom' ? (isRTL ? 'أ' : 'M') : (r.author[0] || 'U')}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                        <span className="font-serif-elegant font-bold text-dark-brown text-sm">{r.author === 'Mom' ? t('questionSection.momAuthor') : r.author}</span>
                                                        <span className="text-[10px] text-dark-brown/30">{new Date(r.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                                                    </div>
                                                    <p className={`text-dark-brown/70 text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>{r.content}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Reply Form */}
                                        {replyingTo === q.id && (
                                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                    <input
                                                        autoFocus
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        placeholder={t('questionSection.replyPlaceholder')}
                                                        className={`flex-1 bg-white border border-warm-beige rounded-full px-5 py-2 text-sm focus:border-olive-green focus:ring-2 focus:ring-olive-green/10 outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleReplySubmit(q.id);
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleReplySubmit(q.id)}
                                                        disabled={isSubmitting}
                                                        className="bg-olive-green text-white p-2 rounded-full hover:bg-terracotta transition-colors shadow-warm disabled:opacity-50"
                                                    >
                                                        <Send className={`w-4 h-4 ${isRTL ? 'scale-x-[-1]' : ''}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
