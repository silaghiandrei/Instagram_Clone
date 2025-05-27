import api from './api';
import { Tag } from '../types';

class TagService {
  async getAllTags(): Promise<Tag[]> {
    const response = await api.get('/tags/getAll');
    return response.data;
  }

  async createTag(name: string): Promise<Tag> {
    const response = await api.post('/tags/create', { name });
    return response.data;
  }
}

export const tagService = new TagService(); 