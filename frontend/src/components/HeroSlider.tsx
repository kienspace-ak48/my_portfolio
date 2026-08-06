import React, { useState, useEffect } from 'react';
import SliderItem from './SliderItem';
import { mockSliderItems } from '../data/mockData';

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = mockSliderItems.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className="relative w-full h-80 sm:h-96 md:h-120 overflow-hidden rounded-lg mt-4">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {mockSliderItems.map((item) => (
          <div key={item.id} className="w-full flex-shrink-0">
            <SliderItem {...item} />
          </div>
        ))}
      </div>

      {/* Slider Indicators (Optional) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {mockSliderItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
