-- CreateTable
CREATE TABLE `resume_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `content` JSON NULL,
    `cv_pdf_url` VARCHAR(191) NULL,
    `cv_pdf_file_name` VARCHAR(191) NULL,
    `cv_pdf_public_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
