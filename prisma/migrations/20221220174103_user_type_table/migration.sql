/*
  Warnings:

  - Added the required column `typeId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "typeId" SMALLINT NOT NULL;

-- CreateTable
CREATE TABLE "user_type" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(512),

    CONSTRAINT "user_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "user_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
