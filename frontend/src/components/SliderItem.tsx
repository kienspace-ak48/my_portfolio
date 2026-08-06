import React from 'react';

interface SliderItemProps {
  imageSrc: string;
  title: string;
  description: string;
  callToAction: string;
}

const SliderItem: React.FC<SliderItemProps> = ({ imageSrc, title, description, callToAction }) => {
  return (
    <div className="relative w-full h-full bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${imageSrc})` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-500 opacity-90 rounded-lg"></div>
      <div className="relative p-8 flex flex-col justify-center items-start h-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{title}</h2>
        <p className="text-sm sm:text-base text-white mb-6 max-w-xl">{description}</p>
        <button className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-md hover:bg-gray-100 transition duration-300">
          {callToAction}
        </button>
      </div>
    </div>
  );
};

export default SliderItem;