import React from 'react';

const CommentsSkeleton: React.FC = () => {
  return (
    <div className="w-[500px] h-[100px] mb-4 last:mb-0 bg-gradient-to-r from-[#6d6d6d] via-[#969696] to-[#6d6d6d] bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
  );
};

export default CommentsSkeleton;
