import api from './api';

export interface Tag {
  name: string;
}

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