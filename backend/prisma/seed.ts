import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./prisma/db/database.sqlite',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seeded categories:', categories);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
  