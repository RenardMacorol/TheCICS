export interface CommentRecord{
  commentID: number;
  userID: string;
  thesisID: number;
  userName: string;
  content: string;
  createdAt: string;
  Users: {
    name: string;
    commentRestricted: 'Restricted' | 'Active';
  };
};

