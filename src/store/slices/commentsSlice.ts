import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../index';
import api from '../../api';
import { Comment } from '../../types/comments';

type CommentsState = {
  comments: Comment[];
  total: number;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
};

const initialState: CommentsState = {
  comments: [],
  total: 0,
  loading: false,
  successMessage: null,
  errorMessage: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    getCommentsRequest: state => {
      state.loading = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    getCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.comments = action.payload;
    },
    getCommentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    getTotalComments: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },

    addCommentRequest: state => {
      state.errorMessage = null;
      state.successMessage = null;
    },
    addCommentSuccess: (state, action: PayloadAction<Comment>) => {
      state.comments = [action.payload, ...state.comments.slice(0, 9)];
      state.successMessage = 'Comment successfully added';
      state.errorMessage = null;
    },
    addCommentFailure: (state, action: PayloadAction<string>) => {
      state.successMessage = null;
      state.errorMessage = action.payload;
    },

    deleteCommentRequest: state => {
      state.errorMessage = null;
      state.successMessage = null;
    },
    deleteCommentSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
      state.successMessage = 'Comment successfully deleted';
      state.errorMessage = null;
    },
    deleteCommentFailure: (state, action: PayloadAction<string>) => {
      state.successMessage = null;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  getCommentsRequest,
  getCommentsSuccess,
  getCommentsFailure,
  getTotalComments,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deleteCommentFailure,
} = commentsSlice.actions;

export default commentsSlice.reducer;

export const getComments = (limit: number, skip: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getCommentsRequest());

    const response = await api.comments.getComments(limit, skip);
    const { comments, total } = response?.data || {};

    dispatch(getCommentsSuccess(comments));
    dispatch(getTotalComments(total));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(getCommentsFailure(error.message));
    } else {
      dispatch(getCommentsFailure('Error loading comments'));
    }
  }
};

export const postComment =
  (body: string, postId: number, userId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(addCommentRequest());

      const response = await api.comments.addComments(body, postId, userId);

      dispatch(addCommentSuccess(response.data));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(addCommentFailure(error.message));
      } else {
        dispatch(addCommentFailure('Error adding comment'));
      }
    }
  };

export const removeComment =
  (commentId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(deleteCommentRequest());

      const state = getState();
      const { comments } = state.comments;

      // fake API can't remove item with ID over 340
      if (commentId <= 340) {
        await api.comments.deleteComments(commentId);
      }

      // functionality that allows you to leave 10 comments on a page after deletion, except for the case when there are several created comments with ID 341
      const updatedComments = comments.filter(comment => comment.id !== commentId);

      const lastId = comments.reduce((lastId, comment) => {
        if (comment.id <= 340) {
          lastId = comment.id > lastId ? comment.id : lastId;
        }

        if (lastId >= 341 && comment.id <= 340) {
          lastId = comment.id;
        }

        return lastId;
      }, updatedComments[0].id);

      const finalId = lastId >= 341 ? 1 : lastId + 1;

      const response = await api.comments.getCommentById(finalId);
      const addedComment: Comment = response.data;

      dispatch(deleteCommentSuccess([...updatedComments, addedComment]));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(deleteCommentFailure(error.message));
      } else {
        dispatch(deleteCommentFailure('Error deleting comment'));
      }
    }
  };
