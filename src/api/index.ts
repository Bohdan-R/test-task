import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

export default {
  comments: {
    getComments: (limit = 10, skip = 0) =>
      api.get(`/comments`, {
        params: { limit, skip },
      }),
    getCommentById: (commentId: number) => api.get(`/comments/${commentId}`),
    addComments: (body: string, postId: number, userId: number) =>
      api.post(`/comments/add`, { body, postId, userId }),
    deleteComments: (commentId: number) => api.delete(`/comments/${commentId}`),
  },
};
