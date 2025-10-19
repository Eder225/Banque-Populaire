import React from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  imageUrl: string;
  title: string;
  description: string;
  features: Feature[];
  ctaText: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  imagePosition?: 'left' | 'right';
  id?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  imageUrl,
  title,
  description,
  features,
  ctaText,
  ctaHref,
  onCtaClick,
  imagePosition = 'left',
  id,
}) => {
  const imageOrderClass = imagePosition === 'right' ? 'md:order-last' : '';
  const bgColor = imagePosition === 'left' ? 'bg-gray-50' : 'bg-white';
  
  const CtaElement = ctaHref ? 'a' : 'button';
  const ctaProps = ctaHref ? { href: ctaHref } : { onClick: onCtaClick };


  return (
    <section id={id} className={`py-20 ${bgColor} overflow-hidden`}>
      <div className="container mx-auto px-6">
        <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 lg:gap-20">
          <div className={`animate-fade-in-up ${imageOrderClass}`}>
            <img 
              className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-video" 
              src={imageUrl} 
              alt={title}
              width="600"
              height="400"
            />
          </div>
          <div className="mt-8 md:mt-0 animate-fade-in-up animation-delay-200">
            <h2 className="text-3xl md:text-4xl font-bold text-horizon-blue-primary">{title}</h2>
            <p className="mt-4 text-lg text-horizon-gray">
              {description}
            </p>
            <div className="mt-8 space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-horizon-accent">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-horizon-blue-primary">{feature.title}</h3>
                    <p className="text-sm text-horizon-gray mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <CtaElement 
                {...ctaProps}
                className="inline-block bg-horizon-accent text-horizon-blue-primary px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg text-center"
              >
                {ctaText}
              </CtaElement>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;