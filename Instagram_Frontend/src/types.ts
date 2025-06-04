export interface User {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  score: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  text: string;
  dateTime?: string;
  image?: string;
  author: User;
  tags?: Tag[];
  status?: 'JUST_POSTED' | 'FIRST_REACTIONS' | 'OUTDATED';
  isCommentable: boolean;
  upvotes?: number;
  downvotes?: number;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  score: number;
  bio?: string;
  followers?: number;
  following?: number;
}

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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
}

