'use client';

import React from 'react';
import Image from 'next/image';

interface Props {
  techStack: string[];
}

const PostTechStackIcons: React.FC<Props> = ({ techStack }) => (
  <>
    {techStack.map((tech) => (
      <div key={tech} className="inline-flex items-center mr-1">
        <div className="flex items-center my-1 bg-fillNormal px-2.5 py-1 rounded-full">
          <Image
            src={`/Stacks/${tech}.svg`}
            alt={tech}
            width={20}
            height={20}
            className="mr-1"
            style={{ width: '20px', height: '20px' }}
          />
          <span className="text-baseS text-labelNeutral">{tech}</span>
        </div>
      </div>
    ))}
  </>
);

export default PostTechStackIcons;