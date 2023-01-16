import { Prisma } from '@prisma/client';

export const customerFields: Prisma.customerArgs['select'] = {
  id: true,
  name: true,
  lastName: true,
  imgUrl: true,
  updatedAt: true,
  type: { select: { id: true, name: true } },
  session: {
    select: {
      timesLoggedIn: true,
      lastAccess: true,
      email: true,
      password: true,
    },
  },
};
// 1: Define a type that includes the relation to `Post`
const customerWithAllAttributes = Prisma.validator<Prisma.customerArgs>()({
  include: {
    type: { select: { id: true, name: true } },
    session: {
      select: {
        timesLoggedIn: true,
        lastAccess: true,
        email: true,
        password: true,
      },
    },
  },
});

// 2: Define a type that only contains a subset of the scalar fields
const customerBaseData = Prisma.validator<Prisma.customerArgs>()({
  select: {
    id: true,
    name: true,
    lastName: true,
    imgUrl: true,
    updatedAt: true,
  },
});

// 3: This type will include a user and all their posts
export type customer = Prisma.customerGetPayload<
  typeof customerWithAllAttributes
>;
