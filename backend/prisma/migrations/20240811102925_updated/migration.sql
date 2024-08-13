/*
  Warnings:

  - You are about to drop the column `authorName` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookName` on the `Book` table. All the data in the column will be lost.
  - Added the required column `author` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "authorName",
DROP COLUMN "bookName",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "book" TEXT NOT NULL;
