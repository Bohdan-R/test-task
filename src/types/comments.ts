export type User = {
  id: number;
  username: string;
  fullName: string;
};

export type Comment = {
  body: string;
  id: number;
  likes: number;
  postId: number;
  user: User;
};

export type ResponseDataComments = {
  comments: Comment[];
  total: number;
};
