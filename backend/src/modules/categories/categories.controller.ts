import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/interfaces/paginated.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<Paginated<Category>> {
    return this.categoriesService.findAll(paginationDto);
  }
}
