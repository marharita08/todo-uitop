import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Category } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { getPaginationParams, paginate } from 'src/common/utils/paginate.util';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto): Promise<Paginated<Category>> {
    const { skip, take } = getPaginationParams(paginationDto);

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
        skip,
        take,
      }),
      this.prisma.category.count(),
    ]);

    return paginate(data, total, paginationDto);
  }

  async findOneOrFail(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }
}
