import { useCallback, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getComments, postComment } from './store/slices/commentsSlice';
import { ITEM_LIMIT } from './helpers/constsnts';
import CommentsList from './components/comments-list';
import PaginationComponent from './components/pagination';
import CommentsSkeleton from './components/comments-skeleton';
import Textarea from './components/textarea';
import Button from './components/button';

import 'react-toastify/dist/ReactToastify.css';

const savedPage = Number(localStorage.getItem('currentPage')) || 1;
const savedComment = localStorage.getItem('comment') || '';

function App() {
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [currentPage, setCurrentPage] = useState(savedPage);
  const [skip, setSkip] = useState(0);
  const [comment, setComment] = useState(savedComment);

  const { comments, total, loading, successMessage, errorMessage } = useAppSelector(
    state => state.comments,
  );

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        theme: 'dark',
      });
    }

    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'dark',
      });
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    dispatch(getComments(ITEM_LIMIT, skip));
  }, [skip]);

  useEffect(() => {
    const newSkip = (currentPage - 1) * 10;
    setSkip(newSkip);
  }, [currentPage]);

  const onChangePage = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page.toString());
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const debouncedSaveComment = useCallback(
    _.debounce((newComment: string) => {
      localStorage.setItem('comment', newComment);
    }, 300),
    [],
  );

  const handleAddComment = () => {
    if (!comment && textareaRef.current) {
      return textareaRef.current.focus();
    }
    dispatch(postComment(comment, 3, 5));
    setComment('');
    localStorage.removeItem('comment');
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    debouncedSaveComment(newComment);
  };
  return (
    <div className="flex flex-wrap justify-center flex-col content-center p-20">
      <div className="flex flex-wrap justify-center flex-col content-center w-[500px] mb-12">
        <Textarea
          ref={textareaRef}
          placeholder="Write a new comment..."
          value={comment}
          onChange={handleCommentChange}
        />
        <Button onClick={handleAddComment} isDisabled={!comment}>
          Add comment
        </Button>
      </div>
      {loading ? (
        Array.from({ length: ITEM_LIMIT }, (_, i) => i + 1).map(item => (
          <CommentsSkeleton key={item} />
        ))
      ) : (
        <CommentsList comments={comments} />
      )}

      <PaginationComponent
        currentPage={currentPage}
        pageSize={ITEM_LIMIT}
        totalItems={total}
        onChange={onChangePage}
      />

      <ToastContainer />
    </div>
  );
}

export default App;
