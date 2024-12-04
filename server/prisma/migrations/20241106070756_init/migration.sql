-- CreateTable
CREATE TABLE `exam_catalogue` (
    `id` VARCHAR(191) NOT NULL,
    `exam_code` VARCHAR(191) NOT NULL,
    `exam_name` VARCHAR(191) NOT NULL,
    `timebased` BOOLEAN NOT NULL,
    `viewback` BOOLEAN NOT NULL,
    `duration` INTEGER NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL,
    `last_updated_date` DATETIME(3) NOT NULL,
    `last_updated_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blf_catalogue_questions` (
    `id` VARCHAR(191) NOT NULL,
    `question_code` VARCHAR(10) NOT NULL,
    `question` VARCHAR(100) NOT NULL,
    `timeinsec` INTEGER NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL,
    `last_updated_date` DATETIME(3) NOT NULL,
    `last_updated_by` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `blf_catalogue_questions_question_code_key`(`question_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blf_catalogue_key` (
    `id` VARCHAR(191) NOT NULL,
    `key_code` VARCHAR(10) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `question_id` VARCHAR(191) NOT NULL,
    `correctkey` BOOLEAN NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NOT NULL,
    `last_updated_date` DATETIME(3) NOT NULL,
    `last_updated_by` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `blf_catalogue_key_key_code_key`(`key_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ExamQuestions` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ExamQuestions_AB_unique`(`A`, `B`),
    INDEX `_ExamQuestions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blf_catalogue_key` ADD CONSTRAINT `blf_catalogue_key_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `blf_catalogue_questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExamQuestions` ADD CONSTRAINT `_ExamQuestions_A_fkey` FOREIGN KEY (`A`) REFERENCES `blf_catalogue_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExamQuestions` ADD CONSTRAINT `_ExamQuestions_B_fkey` FOREIGN KEY (`B`) REFERENCES `exam_catalogue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
