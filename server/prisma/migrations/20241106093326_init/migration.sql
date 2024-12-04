/*
  Warnings:

  - You are about to drop the column `created_by` on the `exam_catalogue` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `exam_catalogue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exam_catalogue` DROP COLUMN `created_by`,
    ADD COLUMN `createdBy` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `exam_catalogue` ADD CONSTRAINT `exam_catalogue_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
