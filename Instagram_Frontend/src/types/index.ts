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