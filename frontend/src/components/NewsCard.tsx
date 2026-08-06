import React from 'react';

interface NewsCardProps {
  imageSrc: string;
  title: string;
  shortUrl: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ imageSrc, title, shortUrl }) => {
  return (
    <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={imageSrc} alt={title} className="w-full h-32 object-cover" />
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{title}</h3>
      </div>
    </a>
  );
};

export default NewsCard;
