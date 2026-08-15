-- Blog categories table + migrate blog_post.category enum → category_slug

CREATE TABLE `blog_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `blog_category` (`slug`, `label`, `sort_order`, `is_active`, `updated_at`) VALUES
('backend', 'Backend', 1, true, CURRENT_TIMESTAMP(3)),
('frontend', 'Frontend', 2, true, CURRENT_TIMESTAMP(3)),
('devops', 'DevOps', 3, true, CURRENT_TIMESTAMP(3)),
('career', 'Career', 4, true, CURRENT_TIMESTAMP(3)),
('tutorial', 'Tutorial', 5, true, CURRENT_TIMESTAMP(3));

ALTER TABLE `blog_post` ADD COLUMN `category_slug` VARCHAR(191) NOT NULL DEFAULT 'tutorial';

UPDATE `blog_post` SET `category_slug` = LOWER(`category`);

ALTER TABLE `blog_post` ADD CONSTRAINT `blog_post_category_slug_fkey` FOREIGN KEY (`category_slug`) REFERENCES `blog_category`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `blog_post` DROP COLUMN `category`;

CREATE INDEX `blog_post_category_slug_idx` ON `blog_post`(`category_slug`);
