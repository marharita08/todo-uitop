import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env.validation';
import { TodosModule } from './modules/todos/todos.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    TodosModule,
    CategoriesModule,
    PrismaModule,
  ],
  providers: [PrismaService],
  controllers: [AppController],
})
export class AppModule {}
