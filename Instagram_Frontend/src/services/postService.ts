import api from './api';
import { Post } from '../types';

class PostService {
  async createPost(formData: FormData) {
    const response = await api.post<Post>('/contents/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async createComment(postId: number, formData: FormData) {
    formData.append('type', 'COMMENT');
    formData.append('parentId', postId.toString());
    formData.append('isCommentable', 'false');
    
    const response = await api.post<Post>('/contents/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getAllPosts() {
    const response = await api.get<Post[]>('/contents/posts');
    return response.data;
  }

  async getPostById(id: number) {
    const response = await api.get<Post>(`/contents/get/${id}`);
    return response.data;
  }

  async getPostsByAuthor(authorId: number) {
    const response = await api.get<Post[]>(`/contents/posts/author/${authorId}`);
    return response.data;
  }

  async getPostsByUserId(userId: number) {
    const response = await api.get<Post[]>(`/contents/posts/author/${userId}`);
    return response.data;
  }

  async getCommentsByPost(postId: number) {
    const response = await api.get<Post[]>(`/contents/comments/parent/${postId}`);
    return response.data;
  }

  async updatePost(postId: number, data: { title: string; text: string }) {
    const response = await api.put<Post>(`/contents/update/${postId}`, data);
    return response.data;
  }

  async deletePost(postId: number) {
    await api.delete(`/contents/delete/${postId}`);
  }
}

export const postService = new PostService(); 