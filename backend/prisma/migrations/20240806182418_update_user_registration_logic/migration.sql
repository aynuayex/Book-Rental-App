/*
  Warnings:

  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'OWNER', 'SYSADMIN');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';

-- DropEnum
DROP TYPE "Roles";

-- CreateIndex
CREATE UNIQUE INDEX "User_role_key" ON "User"("role");
