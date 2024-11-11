/*
  Warnings:

  - You are about to drop the column `profileImageUrl` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_imageId_fkey";

-- DropIndex
DROP INDEX "user_imageId_key";

-- AlterTable
ALTER TABLE "image" DROP COLUMN "profileImageUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "imageId";

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
