/*
  Warnings:

  - You are about to drop the `LogMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LogMessage" DROP CONSTRAINT "LogMessage_deviceId_fkey";

-- DropTable
DROP TABLE "LogMessage";

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
