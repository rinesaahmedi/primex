// src/components/About.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    // Helper to render lists from translation keys
    const renderList = (key) => {
        const items = t(key, { returnObjects: true });
        if (!Array.isArray(items)) return null;
        return items.map((item, index) => <li key={index}>{item}</li>);
    };

    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Main Title and Intro */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{t('about.mainTitle')}</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('about.intro')}</p>
                </div>

                {/* Grid Layout for Core Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Who We Are & Expertise */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('about.whoWeAre.title')}</h3>
                        <p className="text-gray-700 mb-6">{t('about.whoWeAre.description')}</p>
                        
                        <h4 className="text-2xl font-semibold text-gray-800 mb-3">{t('about.expertise.title')}</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {renderList('about.expertise.items')}
                        </ul>
                    </div>

                    {/* From Manual to AI */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('about.aiEvolution.title')}</h3>
                        <p className="text-gray-700 mb-6">{t('about.aiEvolution.description')}</p>
                        
                        <div className="bg-blue-100 p-6 rounded-lg">
                            <h4 className="text-2xl font-semibold text-blue-900 mb-3">{t('about.aiAgent.title')}</h4>
                            <p className="text-blue-800 font-medium mb-4">{t('about.aiAgent.subtitle')}</p>
                            <ul className="list-disc pl-5 space-y-2 text-blue-800">
                                {renderList('about.aiAgent.features')}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Why PRIMEX Section */}
                <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
                    <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">{t('about.whyPrimex.title')}</h3>
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                        {t('about.whyPrimex.points', { returnObjects: true }).map((point, index) => (
                            <li key={index} className="bg-gray-100 p-4 rounded-md font-semibold text-gray-700">{point}</li>
                        ))}
                    </ul>
                </div>

                {/* Vision and Mission */}
                <div className="text-center mt-16">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('about.visionMission.title')}</h3>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">{t('about.visionMission.description')}</p>
                    <p className="text-xl font-bold text-blue-600">{t('about.tagline')}</p>
                </div>
            </div>
        </section>
    );
};

export default About;