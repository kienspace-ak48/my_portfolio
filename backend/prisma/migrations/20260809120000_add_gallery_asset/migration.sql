-- CreateTable
CREATE TABLE `gallery_asset` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `alt` VARCHAR(191) NULL,
    `media_url` VARCHAR(191) NOT NULL,
    `thumbnail_url` VARCHAR(191) NULL,
    `public_id` VARCHAR(191) NULL,
    `media_type` ENUM('IMAGE', 'VIDEO') NOT NULL DEFAULT 'IMAGE',
    `folder` VARCHAR(191) NULL,
    `file_size` INTEGER NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `gallery_asset_media_type_created_at_idx`(`media_type`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
