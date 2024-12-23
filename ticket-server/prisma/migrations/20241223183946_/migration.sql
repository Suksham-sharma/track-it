-- CreateEnum
CREATE TYPE "urlRangeStatus" AS ENUM ('LIVE', 'EXHAUSTED');

-- CreateTable
CREATE TABLE "urlRange" (
    "id" SERIAL NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "status" "urlRangeStatus" NOT NULL,

    CONSTRAINT "urlRange_pkey" PRIMARY KEY ("id")
);
