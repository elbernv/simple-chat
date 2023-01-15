import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { SessionTypes } from '../src/core/enums/sessionTypes.enum';
import {
  CustomerStatus,
  CustomerTypes,
} from '../src/modules/customer/enums/customer.enums';
import { UserStatus, UserTypes } from '../src/modules/user/enums/user.enums';

type PrismaType = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation
>;

const prisma = new PrismaClient();

async function sessionData(prisma: PrismaType) {
  await prisma.session_type.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'user',
    },
  });

  await prisma.session_type.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'customer',
    },
  });
}

async function usersData(prisma: PrismaType) {
  const password = hashSync('12345678', 10);

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

  await prisma.user.create({
    data: {
      name: 'user',
      lastName: 'test',
      imgUrl: 'generic-user.jpg',
      session: {
        create: {
          email: 'user@test.com',
          password,
          type: { connect: { id: SessionTypes.USER } },
        },
      },
      status: { connect: { id: UserTypes.STANDAR } },
      type: { connect: { id: UserStatus.ACTIVE } },
    },
  });
}

async function customersData(prisma: PrismaType) {
  const password = hashSync('12345678', 10);

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

  await prisma.customer.create({
    data: {
      name: 'customer',
      lastName: 'test',
      imgUrl: 'generic-user.jpg',
      session: {
        create: {
          email: 'customer@test.com',
          password,
          type: { connect: { id: SessionTypes.CUSTOMER } },
        },
      },
      status: { connect: { id: CustomerTypes.STANDAR } },
      type: { connect: { id: CustomerStatus.ACTIVE } },
    },
  });
}

async function main() {
  await sessionData(prisma);
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
