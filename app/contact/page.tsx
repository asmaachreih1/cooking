"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Heart, Clock, MessageCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '@/context/LanguageContext';

const Contact = () => {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'submissions'), {
                ...formData,
                status: 'new',
                createdAt: serverTimestamp()
            });

            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-cream min-h-screen">
            {/* Hero Section */}
            <section className="relative py-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-dark-brown/60 z-10" />
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1544145945-f904253db0ad?w=1600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 tatreez-pattern opacity-10 z-10" />
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <span className="text-light-olive font-medium mb-3 block uppercase tracking-widest text-sm">{t('contact.getInTouch')}</span>
                    <h1 className="font-serif-elegant text-5xl md:text-7xl mb-6 text-cream">
                        {t('contact.heroTitle')}
                    </h1>
                    <p className="text-cream/80 max-w-2xl mx-auto text-xl font-light">
                        {t('contact.heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div>
                            <h2 className={`font-serif-elegant text-3xl text-dark-brown mb-8 ${isRTL ? 'text-right' : ''}`}>
                                {t('contact.sendThoughts')}
                            </h2>

                            {/* Warm Message */}
                            <div className="story-box rounded-2xl p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-olive-green/20 rounded-full flex items-center justify-center flex-shrink-0 text-olive-green">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                     <div>
                                        <p className={`text-dark-brown/80 italic ${isRTL ? 'text-right' : ''}`}>
                                            "{t('contact.momQuote')}"
                                        </p>
                                        <p className={`text-olive-green font-medium mt-2 ${isRTL ? 'text-right' : ''}`}>- Mama Montaha</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-6">
                                 <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0 text-terracotta">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark-brown mb-1">{t('contact.emailUs')}</h3>
                                        <a href="mailto:hello@montahakitchen.com" className="text-dark-brown/70 hover:text-olive-green transition-colors">
                                            hello@montahakitchen.com
                                        </a>
                                    </div>
                                </div>

                                 <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0 text-terracotta">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark-brown mb-1">{t('contact.callUs')}</h3>
                                        <p className="text-dark-brown/70">+961 76 371 425</p>
                                    </div>
                                </div>

                                 <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0 text-terracotta">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark-brown mb-1">{t('contact.location')}</h3>
                                        <p className="text-dark-brown/70">{t('contact.locationValue')}</p>
                                    </div>
                                </div>

                                 <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0 text-terracotta">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-dark-brown mb-1">{t('contact.responseTime')}</h3>
                                        <p className="text-dark-brown/70">{t('contact.responseTimeValue')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Kitchen Illustration */}
                            <div className="mt-10 rounded-2xl overflow-hidden shadow-soft">
                                <img
                                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"
                                    alt="Our kitchen"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        </div>

                        {/* Contact Form */}
                         <div className="bg-white rounded-3xl p-8 md:p-10 shadow-warm border border-warm-beige/30">
                            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <MessageCircle className="w-6 h-6 text-olive-green" />
                                <h3 className="font-serif-elegant text-2xl text-dark-brown">{t('contact.sendMessage')}</h3>
                            </div>

                            {isSubmitted ? (
                                 <div className="bg-olive-green/10 rounded-2xl p-8 text-center border border-olive-green/20">
                                    <div className="w-16 h-16 bg-olive-green rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="font-serif-elegant text-2xl text-dark-brown mb-2">
                                        {t('contact.thankYou')}
                                    </h4>
                                    <p className="text-dark-brown/70">
                                        {t('contact.formSuccess')}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                     <div>
                                        <label htmlFor="name" className={`block text-sm font-medium text-dark-brown mb-2 ${isRTL ? 'text-right' : ''}`}>
                                            {t('contact.nameLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-5 py-3 rounded-xl border border-warm-beige bg-cream/50 focus:border-olive-green transition-colors ${isRTL ? 'text-right' : ''}`}
                                            placeholder={t('contact.namePlaceholder')}
                                        />
                                    </div>

                                     <div>
                                        <label htmlFor="email" className={`block text-sm font-medium text-dark-brown mb-2 ${isRTL ? 'text-right' : ''}`}>
                                            {t('contact.emailLabel')}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-5 py-3 rounded-xl border border-warm-beige bg-cream/50 focus:border-olive-green transition-colors ${isRTL ? 'text-right' : ''}`}
                                            placeholder={t('contact.emailPlaceholder')}
                                        />
                                    </div>

                                     <div>
                                        <label htmlFor="subject" className={`block text-sm font-medium text-dark-brown mb-2 ${isRTL ? 'text-right' : ''}`}>
                                            {t('contact.subjectLabel')}
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-5 py-3 rounded-xl border border-warm-beige bg-cream/50 focus:border-olive-green transition-colors ${isRTL ? 'text-right' : ''}`}
                                        >
                                            <option value="">{t('contact.selectTopic')}</option>
                                            <option value="recipe-question">{t('contact.recipeQuestion')}</option>
                                            <option value="cooking-session">{t('contact.cookingSession')}</option>
                                            <option value="catering">{t('contact.catering')}</option>
                                            <option value="feedback">{t('contact.feedback')}</option>
                                            <option value="collaboration">{t('contact.collaboration')}</option>
                                            <option value="other">{t('contact.other')}</option>
                                        </select>
                                    </div>

                                     <div>
                                        <label htmlFor="message" className={`block text-sm font-medium text-dark-brown mb-2 ${isRTL ? 'text-right' : ''}`}>
                                            {t('contact.messageLabel')}
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className={`w-full px-5 py-3 rounded-xl border border-warm-beige bg-cream/50 focus:border-olive-green transition-colors resize-none ${isRTL ? 'text-right' : ''}`}
                                            placeholder={t('contact.messagePlaceholder')}
                                        />
                                    </div>

                                     <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-olive-green text-white py-4 rounded-full font-medium hover:bg-terracotta transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            t('contact.sending')
                                        ) : (
                                            <>
                                                {t('contact.sendButton')}
                                                <Send className={`w-5 h-5 ${isRTL ? 'scale-x-[-1]' : ''}`} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Teaser */}
            <section className="py-16 bg-warm-beige/30">
                <div className="container mx-auto px-4 text-center">
                     <h2 className="font-serif-elegant text-3xl text-dark-brown mb-4">
                        {t('contact.faqTitle')}
                    </h2>
                    <p className="text-dark-brown/70 mb-8 max-w-xl mx-auto">
                        {t('contact.faqSubtitle')}
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            t('contact.faq1'),
                            t('contact.faq2'),
                            t('contact.faq3')
                        ].map((question, index) => (
                            <div key={index} className={`bg-white rounded-xl p-6 shadow-soft text-left border border-warm-beige/20 hover:border-olive-green/30 transition-colors cursor-pointer ${isRTL ? 'text-right' : ''}`}>
                                <p className="text-dark-brown font-medium text-sm">{question}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
