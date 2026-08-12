-- CreateTable
CREATE TABLE `seo_global_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `site_name` VARCHAR(191) NOT NULL,
    `site_url` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(500) NULL,
    `default_title` VARCHAR(191) NOT NULL,
    `default_description` TEXT NOT NULL,
    `default_keywords` TEXT NULL,
    `og_image_url` VARCHAR(191) NULL,
    `twitter_site` VARCHAR(191) NULL,
    `theme_color` VARCHAR(191) NULL DEFAULT '#6366f1',
    `organization_name` VARCHAR(191) NULL,
    `organization_url` VARCHAR(191) NULL,
    `organization_logo_url` VARCHAR(191) NULL,
    `allow_indexing` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seo_page_template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page_key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `title_template` VARCHAR(191) NOT NULL,
    `description_template` TEXT NOT NULL,
    `keywords_template` TEXT NULL,
    `robots` VARCHAR(191) NOT NULL DEFAULT 'index, follow',
    `og_image_url` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `seo_page_template_page_key_key`(`page_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
