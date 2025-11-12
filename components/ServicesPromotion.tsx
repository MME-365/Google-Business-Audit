
import React from 'react';

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const ServiceCard: React.FC<{ title: string, description: string, price: number }> = ({ title, description, price }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
        <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="mt-4 text-gray-600 flex-grow">
            {description}
        </p>
        <div className="mt-6 flex justify-between items-center">
             <p className="text-2xl font-extrabold text-gray-900">${price}</p>
             <a 
                href="#"
                className="inline-block py-2 px-5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
            >
                Buy Now
            </a>
        </div>
    </div>
);


const ServicesPromotion: React.FC = () => {
  return (
    <section className="bg-gray-100 p-6 sm:p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Take Your SEO to the Next Level
        </h2>
        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
          Your Google Business Profile is just the beginning. Supercharge your entire online presence with our expert SEO services.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
            title="DA & PA Improvement"
            description="Boost your Domain and Page Authority to increase your website's ranking power and gain a competitive edge in search results."
            price={50}
        />
        <ServiceCard 
            title="MOZ Score Enhancement"
            description="We optimize key metrics tracked by Moz to improve your overall SEO score, signaling trust and authority to search engines."
            price={50}
        />
        <ServiceCard 
            title="PPC Ads"
            description="Launch targeted Pay-Per-Click campaigns to drive immediate traffic and leads while we build your organic presence."
            price={50}
        />
      </div>
      <div className="text-center mt-10">
        <a 
            href="#"
            className="inline-block py-3 px-8 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        >
            Get a Free SEO Consultation
        </a>
      </div>
    </section>
  );
};

export default ServicesPromotion;
