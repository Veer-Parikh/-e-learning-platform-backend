/*
  Warnings:

  - You are about to drop the column `Rating` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `SuperAdmin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rating` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_superAdminId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "Rating",
DROP COLUMN "popularity",
ADD COLUMN     "rating" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SuperAdmin";
