export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

export interface Post {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
    role: string;
    score: number;
    banned: boolean;
  };
  type: 'POST' | 'COMMENT';
  title: string;
  text: string;
  image?: string; // Base64 string for image
  dateTime?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isCommentable: boolean;
  tags?: string[];
  parent?: Post; // For comments, this will be the parent post
} 