-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "rented" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wallet" TEXT NOT NULL DEFAULT '0';
