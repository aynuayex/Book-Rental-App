-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('CUSTOMER', 'OWNER', 'SYSADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "refreshToken" TEXT[],
    "roles" "Roles" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
