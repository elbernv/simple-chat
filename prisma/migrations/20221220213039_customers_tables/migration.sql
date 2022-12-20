/*
  Warnings:

  - Made the column `statusId` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_statusId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "statusId" SET NOT NULL;

-- CreateTable
CREATE TABLE "customer" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(1024) NOT NULL,
    "lastName" VARCHAR(1024),
    "imgUrl" VARCHAR(5120),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),
    "statusId" SMALLINT NOT NULL,
    "sessionId" BIGINT NOT NULL,
    "typeId" SMALLINT NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_status" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(512),

    CONSTRAINT "customer_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_type" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(512),

    CONSTRAINT "customer_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_sessionId_key" ON "customer"("sessionId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "user_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "customer_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "customer_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
