import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeComment } from '../store/slices/commentsSlice';
import { MdDelete } from 'react-icons/md';
import { Comment } from '../types/comments';
import ButtonIcon from './button-icon';

type CommentsItemProps = {
  comment: Comment;
};

const CommentsItem: React.FC<CommentsItemProps> = ({ comment }) => {
  const dispatch = useAppDispatch();

  const { id, body, user } = comment;

  const handleDeleteComment = (id: number) => {
    dispatch(removeComment(id));
  };
  return (
    <li
      key={id}
      className="relative w-[500px] py-2 px-5 border-2 rounded border-[#212121] text-[#969696] mb-4 last:mb-0 transition-all duration-300 hover:border-[#2979ff]"
    >
      <p className="mb-1 text-[10px]">
        # <span className="font-semibold">{id}</span>
      </p>
      <p className="mb-3 text-[10px]">
        Written by:&nbsp;
        <span className="font-semibold text-white">{user.fullName}</span>
      </p>
      <p className="mb-3 text-[16px] text-white">{body}</p>
      <ButtonIcon
        onClick={() => handleDeleteComment(id)}
        children={
          <MdDelete
            className="text-[#212121] group-hover:text-[#969696] transition-colors duration-300"
            size={25}
          />
        }
      />
    </li>
  );
};

export { CommentsItem };
