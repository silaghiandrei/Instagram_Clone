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
  role: string;
  score: number;
  banned: boolean;
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
    profilePicture?: string;
  };
  type: 'POST' | 'COMMENT';
  title: string;
  text: string;
  image?: string;
  dateTime?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isCommentable: boolean;
  tags?: Tag[];
  parent?: Post;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
  banned?: boolean;
  score?: number;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
}

export interface Tag {
  name: string;
} 