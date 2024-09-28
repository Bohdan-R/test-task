import { useCallback, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import { useLocalStorage } from 'usehooks-ts';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getComments, getCommentsByPage, postComment } from './store/slices/commentsSlice';
import { ITEM_LIMIT } from './helpers/constsnts';
import CommentsList from './components/comments-list';
import PaginationComponent from './components/pagination';
import CommentsSkeleton from './components/comments-skeleton';
import Textarea from './components/textarea';
import Button from './components/button';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [newComment, setNewComment, removeNewComment] = useLocalStorage('comment', '');
  const [page, setPage] = useLocalStorage('currentPage', 1);

  const [currentPage, setCurrentPage] = useState(page);
  const [comment, setComment] = useState(newComment);

  const { commentsPerPage, total, loading, successMessage, errorMessage } = useAppSelector(state => state.comments);

  useEffect(() => {
    if (!total) {
      dispatch(getComments());
    }
  }, []);

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
    const skip = (currentPage - 1) * ITEM_LIMIT;
    dispatch(getCommentsByPage(ITEM_LIMIT, skip));
  }, [currentPage]);

  const onChangePage = (page: number) => {
    setCurrentPage(page);
    setPage(page);
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const debouncedSaveComment = useCallback(
    _.debounce((newComment: string) => {
      setNewComment(newComment);
    }, 300),
    [],
  );

  const handleAddComment = () => {
    if (!comment && textareaRef.current) {
      return textareaRef.current.focus();
    }
    dispatch(postComment(comment, 1000, currentPage));
    setComment('');
    removeNewComment();
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
      {loading || !total ? (
        Array.from({ length: ITEM_LIMIT }, (_, i) => i + 1).map(item => <CommentsSkeleton key={item} />)
      ) : (
        <CommentsList comments={commentsPerPage} />
      )}

      <PaginationComponent currentPage={currentPage} pageSize={ITEM_LIMIT} totalItems={total} onChange={onChangePage} />

      <ToastContainer />
    </div>
  );
}

export default App;
