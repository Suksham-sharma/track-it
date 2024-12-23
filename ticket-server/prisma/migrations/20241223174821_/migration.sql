/*
  Warnings:

  - You are about to drop the `range` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "range";

-- CreateTable
CREATE TABLE "urlRange" (
    "id" SERIAL NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "urlRange_pkey" PRIMARY KEY ("id")
);
