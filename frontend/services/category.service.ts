import { Category, Paginated } from '@/core/types';

import { httpService } from './http.service';

class CategoryService {
  private readonly baseUrl = '/categories';

  async getAll(page = 1, limit = 50): Promise<Paginated<Category>> {
    return httpService.get<Paginated<Category>>(this.baseUrl, { page, limit });
  }
}

export const categoryService = new CategoryService();
