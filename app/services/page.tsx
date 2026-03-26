"use client";

import Link from 'next/link';
import { Users, BookOpen, Heart, ChefHat, MessageSquare, ArrowRight, Utensils, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Services = () => {
    const { t, isRTL } = useLanguage();
    const services = [
        {
            icon: <Users className="w-10 h-10" />,
            title: t('servicesPage.service1Title'),
            price: t('servicesPage.service1Price'),
            description: t('servicesPage.service1Desc'),
            features: [
                t('servicesPage.service1Feature1'),
                t('servicesPage.service1Feature2'),
                t('servicesPage.service1Feature3'),
                t('servicesPage.service1Feature4')
            ],
            image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
        },
        {
            icon: <BookOpen className="w-10 h-10" />,
            title: t('servicesPage.service2Title'),
            price: t('servicesPage.service2Price'),
            description: t('servicesPage.service2Desc'),
            features: [
                t('servicesPage.service2Feature1'),
                t('servicesPage.service2Feature2'),
                t('servicesPage.service2Feature3'),
                t('servicesPage.service2Feature4')
            ],
            image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800"
        },
        {
            icon: <ChefHat className="w-10 h-10" />,
            title: t('servicesPage.service3Title'),
            price: t('servicesPage.service3Price'),
            description: t('servicesPage.service3Desc'),
            features: [
                t('servicesPage.service3Feature1'),
                t('servicesPage.service3Feature2'),
                t('servicesPage.service3Feature3'),
                t('servicesPage.service3Feature4')
            ],
            image: "https://images.unsplash.com/photo-1529543544277-750e-580ea01f-7ed?w=800"
        }
    ];

    return (
        <div className="bg-cream">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-dark-brown/60 z-10" />
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 tatreez-pattern opacity-10 z-10" />
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <span className="text-light-olive font-medium mb-3 block uppercase tracking-widest text-sm">{t('header.services')}</span>
                    <h1 className="font-serif-elegant text-4xl md:text-7xl mb-6 text-cream">
                        {t('servicesPage.heroTitle')}
                    </h1>
                    <p className="text-cream/80 max-w-2xl mx-auto text-xl font-light">
                        {t('servicesPage.heroDesc')}
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-soft flex flex-col h-full border border-warm-beige/30">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                    <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-dark-brown`}>
                                        {service.price}
                                    </div>
                                </div>
                                <div className="p-8 flex-grow">
                                    <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-6 text-olive-green">
                                        {service.icon}
                                    </div>
                                    <h3 className="font-serif-elegant text-2xl text-dark-brown mb-4">{service.title}</h3>
                                    <p className="text-dark-brown/70 mb-6 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-dark-brown/80">
                                                <div className="w-1.5 h-1.5 bg-terracotta rounded-full" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 pt-0 mt-auto">
                                    <Link
                                        href="/contact"
                                        className="block w-full text-center bg-olive-green text-white py-4 rounded-full font-medium hover:bg-terracotta transition-colors shadow-sm"
                                    >
                                        {t('servicesPage.inquireNow')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Experience With Us */}
            <section className="py-20 bg-warm-beige/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-serif-elegant text-4xl text-dark-brown mb-4">{t('servicesPage.theExperience')}</h2>
                        <p className="text-dark-brown/60 max-w-2xl mx-auto">
                            {t('servicesPage.experienceDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <GraduationCap className="w-6 h-6" />,
                                title: t('servicesPage.authenticLearning'),
                                desc: t('servicesPage.authenticLearningDesc')
                            },
                            {
                                icon: <Utensils className="w-6 h-6" />,
                                title: t('servicesPage.traditionalTools'),
                                desc: t('servicesPage.traditionalToolsDesc')
                            },
                            {
                                icon: <MessageSquare className="w-6 h-6" />,
                                title: t('servicesPage.storiesIncluded'),
                                desc: t('servicesPage.storiesIncludedDesc')
                            },
                            {
                                icon: <Heart className="w-6 h-6" />,
                                title: t('servicesPage.smallGroups'),
                                desc: t('servicesPage.smallGroupsDesc')
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-soft">
                                <div className="w-12 h-12 bg-olive-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-olive-green">
                                    {item.icon}
                                </div>
                                <h4 className="font-serif-elegant text-lg text-dark-brown mb-2">{item.title}</h4>
                                <p className="text-dark-brown/60 text-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-warm-beige text-dark-brown relative overflow-hidden">
                <div className="absolute inset-0 tatreez-pattern opacity-10" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-serif-elegant text-4xl md:text-5xl mb-8">
                            {t('servicesPage.ctaTitle')}
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-terracotta text-white px-10 py-5 rounded-full font-medium hover:bg-olive-green transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {t('servicesPage.inquirePrivate')}
                                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-white/80 backdrop-blur-sm text-dark-brown border border-dark-brown/20 px-10 py-5 rounded-full font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                            >
                                {t('servicesPage.bookSession')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
