/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `InrWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InrWallet" DROP CONSTRAINT "InrWallet_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "sub" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "InrWallet";

-- CreateTable
CREATE TABLE "InrWalet" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InrWalet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InrWalet_userId_key" ON "InrWalet"("userId");

-- AddForeignKey
ALTER TABLE "InrWalet" ADD CONSTRAINT "InrWalet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
