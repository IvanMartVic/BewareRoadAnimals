/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Device` table. All the data in the column will be lost.
  - Added the required column `coordLatitude` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordLongitude` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "coordinates",
ADD COLUMN     "coordLatitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "coordLongitude" DOUBLE PRECISION NOT NULL;
