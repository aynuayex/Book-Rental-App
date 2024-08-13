-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_uploadedById_fkey";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "uploadedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
