import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./db/database.sqlite',
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const existingCategories = await prisma.category.count();

  if (existingCategories > 0) {
    console.log('Seed skipped: categories already exist');

    return;
  }

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];

  await prisma.category.createMany({
    data: categories.map((name) => ({
      name,
    })),
  });

  console.log('Seeded categories:', categories);
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
