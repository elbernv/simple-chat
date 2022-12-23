-- AlterTable
ALTER TABLE "session" ADD COLUMN     "typeId" SMALLINT NOT NULL;

-- CreateTable
CREATE TABLE "session_type" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "session_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "session_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
