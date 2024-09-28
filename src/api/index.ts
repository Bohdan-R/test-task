import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

export default {
  comments: {
    getAllComments: () =>
      api.get(`/comments`, {
        params: { limit: 340 },
      }),
  },
};
