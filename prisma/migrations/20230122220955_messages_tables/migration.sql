-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_typeId_fkey";

-- CreateTable
CREATE TABLE "messages" (
    "id" BIGSERIAL NOT NULL,
    "message" VARCHAR(51200) NOT NULL,
    "sentDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readDate" TIMESTAMPTZ(3),
    "customerReceiverId" BIGINT NOT NULL,
    "customerSenderId" BIGINT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "session_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_customerReceiverId_fkey" FOREIGN KEY ("customerReceiverId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_customerSenderId_fkey" FOREIGN KEY ("customerSenderId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
