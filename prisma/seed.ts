import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user_status.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Activo',
      description: 'Usuario Activo',
    },
  });

  await prisma.user_status.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Baneado',
      description: 'Usuario Baneado',
    },
  });

  await prisma.user_type.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Estándar',
      description: 'Usuario Estándar',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
