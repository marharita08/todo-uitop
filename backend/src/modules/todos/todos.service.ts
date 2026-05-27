import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import {
  CreateTodoDto,
  UpdateTodoDto,
  FilterTodoDto,
  BulkUpdateTodoDto,
} from './dto';
import { Paginated } from '../../common/interfaces/paginated.interface';
import { getPaginationParams, paginate } from 'src/common/utils/paginate.util';
import { Todo, TodoStatus } from '@prisma/client';

const MAX_TODOS_PER_CATEGORY = 5;

export type TodoWithCategory = Todo & {
  category: { id: number; name: string };
};

@Injectable()
export class TodosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(
    filterDto: FilterTodoDto,
  ): Promise<Paginated<TodoWithCategory>> {
    const where = {
      ...(filterDto.categoryId && { categoryId: filterDto.categoryId }),
      status: TodoStatus.ACTIVE,
    };

    const { skip, take } = getPaginationParams(filterDto);

    const [data, total] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.todo.count({ where }),
    ]);

    return paginate(data, total, filterDto);
  }

  async create(createTodoDto: CreateTodoDto): Promise<TodoWithCategory> {
    const { text, categoryId } = createTodoDto;

    await this.categoriesService.findOneOrFail(categoryId);

    const count = await this.prisma.todo.count({ where: { categoryId } });

    if (count >= MAX_TODOS_PER_CATEGORY) {
      throw new BadRequestException(
        `Category already has ${MAX_TODOS_PER_CATEGORY} tasks. Cannot add more.`,
      );
    }

    return this.prisma.todo.create({
      data: { text, categoryId },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoWithCategory> {
    await this.findOneOrFail(id);

    return this.prisma.todo.update({
      where: { id },
      data: { status: updateTodoDto.status },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOneOrFail(id);
    await this.prisma.todo.delete({ where: { id } });
    return { message: `Todo ${id} deleted successfully` };
  }

  private async findOneOrFail(id: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  async bulkUpdate(dto: BulkUpdateTodoDto): Promise<{ count: number }> {
    const existing = await this.prisma.todo.findMany({
      where: { id: { in: dto.ids } },
      select: { id: true },
    });

    if (existing.length !== dto.ids.length) {
      const foundIds = existing.map((t) => t.id);
      const missing = dto.ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Todos not found: ${missing.join(', ')}`);
    }

    const { count } = await this.prisma.todo.updateMany({
      where: { id: { in: dto.ids } },
      data: { status: dto.status },
    });

    return { count };
  }
}
