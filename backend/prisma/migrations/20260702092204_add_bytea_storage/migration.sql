/*
  Warnings:

  - You are about to drop the column `publicId` on the `GalleryItem` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `GalleryItem` table. All the data in the column will be lost.
  - Added the required column `data` to the `GalleryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `GalleryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `GalleryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GalleryItem" DROP COLUMN "publicId",
DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL;
