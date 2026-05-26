import { PaginationDto } from '../dto/pagination.dto';
import { Paginated, PaginationMeta } from '../interfaces/paginated.interface';

export function getPaginationParams(dto: PaginationDto): {
  skip: number;
  take: number;
} {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  dto: PaginationDto,
): Paginated<T> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;
  const totalPages = Math.ceil(total / limit);

  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { data, meta };
}
