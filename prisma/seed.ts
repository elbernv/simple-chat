import { Prisma, PrismaClient } from '@prisma/client';

type PrismaType = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation
>;

const prisma = new PrismaClient();

async function usersData(prisma: PrismaType) {
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

async function customersData(prisma: PrismaType) {
  await prisma.customer_status.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Activo',
      description: 'Cliente Activo',
    },
  });

  await prisma.customer_status.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Baneado',
      description: 'Cliente Baneado',
    },
  });

  await prisma.customer_type.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Estándar',
      description: 'Cliente Estándar',
    },
  });
}

async function main() {
  await usersData(prisma);
  await customersData(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
