-- CreateTable
CREATE TABLE `_ExamMembers` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ExamMembers_AB_unique`(`A`, `B`),
    INDEX `_ExamMembers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ExamMembers` ADD CONSTRAINT `_ExamMembers_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExamMembers` ADD CONSTRAINT `_ExamMembers_B_fkey` FOREIGN KEY (`B`) REFERENCES `exam_catalogue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
