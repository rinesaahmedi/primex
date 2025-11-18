import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 py-12 bg-white text-black">
      {/* Introduction Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold mb-4">{t("aboutUsTitle")}</h2>
        <p className="text-xl max-w-2xl mx-auto">{t("aboutUsIntro")}</p>
      </div>

      {/* Expertise and Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-3xl font-semibold mb-4">{t("expertiseTitle")}</h3>
          <p className="text-lg">{t("expertiseDescription")}</p>
        </div>
        <div>
          <h3 className="text-3xl font-semibold mb-4">{t("servicesTitle")}</h3>
          <ul className="list-disc pl-5 text-lg">
            <li>{t("service1")}</li>
            <li>{t("service2")}</li>
            <li>{t("service3")}</li>
            <li>{t("service4")}</li>
            <li>{t("service5")}</li>
          </ul>
        </div>
      </div>

      {/* Tech Innovations */}
      <div className="text-center mb-16">
        <h3 className="text-3xl font-semibold mb-4">{t("techInnovationTitle")}</h3>
        <p className="text-lg max-w-3xl mx-auto">{t("techInnovationDescription")}</p>
      </div>

      {/* Why PRIMEX */}
      <div className="bg-gray-100 py-12 mb-16">
        <div className="text-center">
          <h3 className="text-3xl font-semibold mb-4">{t("whyPrimexTitle")}</h3>
          <ul className="list-disc pl-5 text-lg max-w-3xl mx-auto">
            <li>{t("whyPrimex1")}</li>
            <li>{t("whyPrimex2")}</li>
            <li>{t("whyPrimex3")}</li>
            <li>{t("whyPrimex4")}</li>
            <li>{t("whyPrimex5")}</li>
          </ul>
        </div>
      </div>

      {/* Vision and Mission */}
      <div className="text-center">
        <h3 className="text-3xl font-semibold mb-4">{t("visionMissionTitle")}</h3>
        <p className="text-lg max-w-3xl mx-auto">{t("visionMissionDescription")}</p>
      </div>
    </section>
  );
};

export default About;