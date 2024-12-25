-- CreateTable
CREATE TABLE "userLink" (
    "id" INTEGER NOT NULL,
    "destinationUrl" TEXT NOT NULL,
    "shortLink" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "userLink_id_key" ON "userLink"("id");

-- CreateIndex
CREATE UNIQUE INDEX "userLink_shortLink_key" ON "userLink"("shortLink");

-- AddForeignKey
ALTER TABLE "userLink" ADD CONSTRAINT "userLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
