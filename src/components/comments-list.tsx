import React from 'react';
import { Comment } from '../types/comments';
import { CommentsItem } from './comments-item';

type CommentsListProps = {
  comments: Comment[];
};

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  return (
    <ul>
      {comments.map((comment, index) => {
        const key = `${comment.id}-${comment.user.username}-${index}`;
        return <CommentsItem comment={comment} key={key} />;
      })}
    </ul>
  );
};
export default CommentsList;
