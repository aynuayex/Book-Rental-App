-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FICTION', 'SELF_HELP', 'BUSINESS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "bookName" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "quantity" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
