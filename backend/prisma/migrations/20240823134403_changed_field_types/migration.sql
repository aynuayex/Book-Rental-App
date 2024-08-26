/*
  Warnings:

  - The `wallet` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,year,month]` on the table `MonthlyEarnings` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `quantity` on the `Book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `Book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "MonthlyEarnings_year_month_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "quantity",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "wallet",
ADD COLUMN     "wallet" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyEarnings_userId_year_month_key" ON "MonthlyEarnings"("userId", "year", "month");
