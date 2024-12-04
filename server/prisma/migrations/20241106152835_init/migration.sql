/*
  Warnings:

  - You are about to drop the column `key_code` on the `blf_catalogue_key` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `blf_catalogue_key_key_code_key` ON `blf_catalogue_key`;

-- AlterTable
ALTER TABLE `blf_catalogue_key` DROP COLUMN `key_code`;
