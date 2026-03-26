"use client";

import { Heart, Leaf, Users, Award, Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
    const { t, isRTL } = useLanguage();
    return (
        <div className="bg-cream">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-dark-brown tatreez-pattern-red relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-olive-green font-medium mb-3 block uppercase tracking-widest text-sm">{t('about.ourStory')}</span>
                    <h1 className="font-serif-elegant text-4xl md:text-7xl mb-6 text-cream">
                        {t('about.heritageTitle')}
                    </h1>
                    <p className="text-cream/80 max-w-2xl mx-auto text-xl font-light">
                        {t('about.heritageDesc')}
                    </p>
                </div>
            </section>

            {/* Main Story */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className={`${isRTL ? 'order-2' : 'order-2 lg:order-1'}`}>
                            <h2 className={`font-serif-elegant text-4xl text-dark-brown mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t('about.motherTitle')}
                            </h2>
                            <div className={`space-y-4 text-dark-brown/70 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <p>
                                    {t('about.storyP1')}
                                </p>
                                <p>
                                    {t('about.storyP2')}
                                </p>
                                <p>
                                    {t('about.storyP3')}
                                </p>
                            </div>

                            <div className="mt-8 p-6 story-box rounded-xl">
                                <Quote className={`w-8 h-8 text-olive-green mb-3 ${isRTL ? 'scale-x-[-1]' : ''}`} />
                                <p className={`text-dark-brown italic text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                                    "{t('about.quote')}"
                                </p>
                                <p className={`text-olive-green font-medium mt-3 ${isRTL ? 'text-left' : 'text-right'}`}>- Teta Em Hsein</p>
                            </div>
                        </div>

                        <div className={`${isRTL ? 'order-1' : 'order-1 lg:order-2'} relative`}>
                            <div className="rounded-3xl overflow-hidden shadow-warm">
                                <img
                                    src="https://www.saveur.com/uploads/2024/03/HERO-DSC_0698-scaled.jpg?format=auto&optimize=high&width=1440"
                                    alt="Traditional cooking"
                                    className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
                                />
                            </div>
                            <div className={`absolute -bottom-4 ${isRTL ? '-right-4 md:-bottom-8 md:-right-8' : '-left-4 md:-bottom-8 md:-left-8'} bg-white p-1 md:p-1.5 rounded-2xl shadow-medium`}>
                                <img
                                    src="https://static01.nyt.com/images/2022/08/08/world/08palestinian-food8/merlin_208194414_ff79fc56-1c8c-4e4d-beee-026d4ded1fe6-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
                                    alt="Grandmother's hands"
                                    className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cultural Importance */}
            <section className="py-20 bg-warm-beige">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-olive-green font-medium mb-2 block">{t('about.culturalHeritage')}</span>
                        <h2 className="font-serif-elegant text-4xl text-dark-brown mb-4">
                            {t('about.moreThanFood')}
                        </h2>
                        <p className="text-dark-brown/70 max-w-2xl mx-auto">
                            {t('about.culturalDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Heart className="w-8 h-8 text-deep-red" />,
                                title: t('about.actsOfLove'),
                                description: t('about.actsOfLoveDesc'),
                                image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400'
                            },
                            {
                                icon: <Users className="w-8 h-8 text-olive-green" />,
                                title: t('about.gatheringTogether'),
                                description: t('about.gatheringTogetherDesc'),
                                image: 'https://www.shutterstock.com/image-photo/lebanese-family-gossip-260nw-2548683905.jpg'
                            },
                            {
                                icon: <Leaf className="w-8 h-8 text-terracotta" />,
                                title: t('about.honoringLand'),
                                description: t('about.honoringLandDesc'),
                                image: 'https://bethbc.edu/wp-content/uploads/2021/10/64487-scaled.jpg'
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-soft">
                                <div className="h-48">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-serif-elegant text-xl text-dark-brown mb-3">{item.title}</h3>
                                    <p className="text-dark-brown/70 text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Kitchen Gallery */}
            <section className="py-20 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-olive-green font-medium mb-2 block">{t('about.behindScenes')}</span>
                        <h2 className="font-serif-elegant text-4xl text-dark-brown">{t('about.lifeInKitchen')}</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', alt: 'Cooking process' },
                            { src: 'https://images.unsplash.com/photo-1577308856961-8e9ec50d0c67?w=400', alt: 'Fresh ingredients' },
                            { src: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400', alt: 'Spices' },
                            { src: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400', alt: 'Fresh vegetables' },
                            { src: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=400', alt: 'Bread making' },
                            { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', alt: 'Finished dish' },
                            { src: 'https://www.shutterstock.com/image-photo/fish-eye-photo-lebanese-family-260nw-2537694949.jpg', alt: 'Table setting' },
                            { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', alt: 'Fresh salad' }
                        ].map((image, index) => (
                            <div key={index} className="rounded-xl overflow-hidden shadow-soft img-hover-zoom aspect-square">
                                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-dark-brown text-cream relative overflow-hidden">
                <div className="absolute inset-0 tatreez-pattern-red opacity-15" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="font-serif-elegant text-4xl mb-4">{t('about.whatWeBelieve')}</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:grid-cols-4 md:gap-8 max-w-5xl mx-auto">
                        {[
                            { icon: <Heart />, title: t('about.authenticity'), description: t('about.authenticityDesc') },
                            { icon: <Users />, title: t('about.community'), description: t('about.communityDesc') },
                            { icon: <Leaf />, title: t('about.freshness'), description: t('about.freshnessDesc') },
                            { icon: <Award />, title: t('about.tradition'), description: t('about.traditionDesc') }
                        ].map((value, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-olive-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="font-serif-elegant text-xl mb-2">{value.title}</h3>
                                <p className="text-cream/70 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-olive-green font-medium mb-2 block">{t('about.ourJourney')}</span>
                        <h2 className="font-serif-elegant text-4xl text-dark-brown">{t('about.threeGenerations')}</h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {[
                            { year: '1950s', title: t('about.timeline1Title'), description: t('about.timeline1Desc') },
                            { year: '1980s', title: t('about.timeline2Title'), description: t('about.timeline2Desc') },
                            { year: '1990s', title: t('about.timeline3Title'), description: t('about.timeline3Desc') },
                            { year: '2020s', title: t('about.timeline4Title'), description: t('about.timeline4Desc') }
                        ].map((item, index) => (
                            <div key={index} className="flex gap-6 mb-8 last:mb-0">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-olive-green rounded-full flex items-center justify-center text-white font-serif-elegant">
                                        {item.year.substring(0, 2)}s
                                    </div>
                                    {index < 3 && <div className="flex-1 w-0.5 bg-olive-green/30 my-2" />}
                                </div>
                                <div className="flex-1 pb-8">
                                    <span className={`text-terracotta font-medium block ${isRTL ? 'text-right' : 'text-left'}`}>{item.year}</span>
                                    <h3 className={`font-serif-elegant text-xl text-dark-brown mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{item.title}</h3>
                                    <p className={`text-dark-brown/70 ${isRTL ? 'text-right' : 'text-left'}`}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
