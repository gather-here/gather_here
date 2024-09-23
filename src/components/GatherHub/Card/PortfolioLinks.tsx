import React, { useMemo } from 'react';

interface PortfolioLinksProps {
  blog?: string;
  notionLink?: string;
  instagramLink?: string;
  isModal?: boolean;
}

const PortfolioLinks: React.FC<PortfolioLinksProps> = ({ blog, notionLink, instagramLink, isModal = false }) => {
  const portfolioLinks = useMemo(() => {
    return [
      { name: 'main', url: blog, icon: '/assets/github-icon.svg', color: 'text-blue-500 hover:text-blue-600' },
      { name: 'Link2', url: notionLink, icon: '/assets/notion-icon.svg', color: 'text-green-300 hover:text-white' },
      { name: 'Link3', url: instagramLink, icon: '/assets/instagram-icon.svg', color: 'text-pink-500 hover:text-pink-600' },
    ].filter(link => link.url);
  }, [blog, notionLink, instagramLink]);

  return (
    <div className={`flex justify-center ${isModal ? 'p-5 space-x-6 text-xs' : 'mt-1 p-2 space-x-8 text-xs'}`}>
      {portfolioLinks.map((link, index) => (
        <a 
          key={index} 
          href={link.url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex ${isModal ? 'items-center space-x-8' : 'flex-col items-center'} 
                   ${link.color} transition-transform duration-200 ease-in-out transform hover:scale-110`}
        >
          {link.icon ? (
            <img src={link.icon} alt={link.name} className="w-8 h-8 mb-5" />
          ) : (
            <span className={isModal ? '' : 'text-xs'}>{link.name}</span>
          )}
        </a>
      ))}
    </div>
  );
};

export default PortfolioLinks;