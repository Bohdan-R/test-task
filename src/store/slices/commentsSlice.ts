import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../index';
import { Comment, ResponseDataComments } from '../../types/comments';
import { ITEM_LIMIT } from '../../helpers/constsnts';
import api from '../../api';

type CommentsState = {
  allComments: Comment[];
  commentsPerPage: Comment[];
  total: number;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
};

const initialState: CommentsState = {
  allComments: [],
  commentsPerPage: [],
  total: 0,
  loading: false,
  successMessage: null,
  errorMessage: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    getAllCommentsRequest: state => {
      state.loading = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    getAllCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.allComments = action.payload;
    },
    getAllCommentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    getCommentsByPageRequest: state => {
      state.loading = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    getCommentsByPageSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.commentsPerPage = action.payload;
    },
    getCommentsByPageFailure: (state, action: PayloadAction<string>) => {
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
    addCommentSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.commentsPerPage = action.payload;
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
      state.commentsPerPage = action.payload;
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
  getAllCommentsRequest,
  getAllCommentsSuccess,
  getAllCommentsFailure,
  getCommentsByPageRequest,
  getCommentsByPageSuccess,
  getCommentsByPageFailure,
  getTotalComments,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deleteCommentFailure,
} = commentsSlice.actions;

export default commentsSlice.reducer;

export const getComments = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(getAllCommentsRequest());

    const response = await api.comments.getAllComments();
    const { comments, total }: ResponseDataComments = response?.data || { comments: [], total: 0 };

    const sortedComments = comments.sort((a, b) => b.id - a.id);

    dispatch(getAllCommentsSuccess(sortedComments));
    dispatch(getCommentsByPageSuccess(sortedComments.slice(0, ITEM_LIMIT)));
    dispatch(getTotalComments(total));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(getAllCommentsFailure(error.message));
    } else {
      dispatch(getAllCommentsFailure('Error loading comments'));
    }
  }
};

export const getCommentsByPage =
  (limit: number, skip: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(getCommentsByPageRequest());

      const { allComments } = getState().comments;

      dispatch(getCommentsByPageSuccess(allComments.slice(skip, skip + limit)));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(getCommentsByPageFailure(error.message));
      } else {
        dispatch(getCommentsByPageFailure('Error loading comments'));
      }
    }
  };

export const postComment =
  (body: string, userId: number, currentPage: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(addCommentRequest());

      const { allComments, total } = getState().comments;
      const lastId = allComments[0].id + 1;
      const skip = (currentPage - 1) * ITEM_LIMIT;

      const user = {
        id: userId,
        username: 'Dart',
        fullName: 'Weider',
      };

      const newComment = {
        body,
        id: lastId,
        likes: 20,
        postId: 3,
        user,
      };

      const updatedDate = [newComment, ...allComments];

      dispatch(getTotalComments(total + 1));
      dispatch(addCommentSuccess(updatedDate.slice(skip, skip + ITEM_LIMIT)));
      dispatch(getAllCommentsSuccess(updatedDate));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(addCommentFailure(error.message));
      } else {
        dispatch(addCommentFailure('Error adding comment'));
      }
    }
  };

export const removeComment =
  (commentId: number, currentPage: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(deleteCommentRequest());
      const { allComments, total } = getState().comments;

      const skip = (currentPage - 1) * ITEM_LIMIT;

      const updatedComments = allComments.filter(c => c.id !== commentId);

      dispatch(deleteCommentSuccess(updatedComments.slice(skip, skip + ITEM_LIMIT)));
      dispatch(getAllCommentsSuccess(updatedComments));
      dispatch(getTotalComments(total - 1));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(deleteCommentFailure(error.message));
      } else {
        dispatch(deleteCommentFailure('Error deleting comment'));
      }
    }
  };
