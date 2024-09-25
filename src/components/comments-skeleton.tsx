import React from 'react';

type CommentsSkeletonProps = {
  key: number;
};

const CommentsSkeleton: React.FC<CommentsSkeletonProps> = ({ key }) => {
  return (
    <div
      key={key}
      className="w-[500px] h-[100px] mb-4 last:mb-0 bg-gradient-to-r from-[#6d6d6d] via-[#969696] to-[#6d6d6d] bg-[length:200%_100%] animate-shimmer rounded-lg"
    ></div>
  );
};

export default CommentsSkeleton;
