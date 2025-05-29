import api from './api';
import { Post } from '../types';

class PostService {
  async createPost(formData: FormData) {
    try {
      const response = await api.post<Post>('/contents/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Clear any invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error('Your session has expired. Please log in again.');
      }
      throw error;
    }
  }

  async createComment(postId: number, formData: FormData) {
    try {
      formData.append('type', 'COMMENT');
      formData.append('parentId', postId.toString());
      formData.append('isCommentable', 'false');
      
      const response = await api.post<Post>('/contents/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error('Your session has expired. Please log in again.');
      }
      throw error;
    }
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

  async updatePost(postId: number, postData: Post) {
    try {
      // Only send title and text for update
      const contentDTO = {
        id: postData.id,
        title: postData.title,
        text: postData.text,
        isCommentable: postData.isCommentable
      };

      console.log('Sending ContentDTO:', contentDTO);
      const response = await api.put<Post>(`/contents/update/${postId}`, contentDTO);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating post:', error.response?.data || error.message);
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Failed to update post');
    }
  }

  async updatePostStatus(postId: number, status: string) {
    try {
      const response = await api.put<Post>(`/contents/update-status/${postId}?status=${status}`);
      return response.data;
    } catch (error: any) {
      console.error('Error updating post status:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update post status');
    }
  }

  async deletePost(postId: number) {
    await api.delete(`/contents/delete/${postId}`);
  }

  async votePost(postId: number, userId: number, voteType: 'UPVOTE' | 'DOWN_VOTE'): Promise<Post> {
    try {
      const response = await api.post<Post>(`/contents/${postId}/vote`, null, {
        params: {
          userId,
          voteType
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error('Your session has expired. Please log in again.');
      }
      throw error;
    }
  }

  async removeVote(postId: number, userId: number): Promise<Post> {
    try {
      const response = await api.delete<Post>(`/contents/${postId}/vote`, {
        params: {
          userId
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        throw new Error('Your session has expired. Please log in again.');
      }
      throw error;
    }
  }
}

export const postService = new PostService(); 