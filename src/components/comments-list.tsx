import React from 'react';
import { Comment } from '../types/comments';
import { CommentsItem } from './comments-item';

type CommentsListProps = {
  comments: Comment[];
};

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  return (
    <ul>
      {comments.map(comment => {
        return <CommentsItem comment={comment} />;
      })}
    </ul>
  );
};
export default CommentsList;
