import React from 'react';
import Image from 'next/image';

interface BackgroundImageProps {
  backgroundImageUrl: string;
  blog: string;
  isModal?: boolean;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ backgroundImageUrl, blog, isModal = false }) => {
  return (
    <div 
      className={`relative w-full ${isModal ? 'h-[300px]' : 'h-[250px]'} bg-gray-300 rounded-t-[20px] overflow-hidden cursor-pointer group`}
      onClick={() => window.open(blog, '_blank')}
    >
      {backgroundImageUrl ? (
        <Image 
          src={backgroundImageUrl} 
          alt="포트폴리오" 
          layout="fill" 
          objectFit="cover" 
          className="transition-transform duration-300 ease-in-out hover:scale-105" 
        />
      ) : (
        <Image 
          src="/logos/hi.png" 
          alt="기본 이미지" 
          layout="fill" 
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out hover:scale-105" 
        />
      )}
    </div>
  );
};

export default BackgroundImage;