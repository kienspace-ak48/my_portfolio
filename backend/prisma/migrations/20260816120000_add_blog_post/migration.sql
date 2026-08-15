-- CreateTable: blog_post + blog_post_tag

CREATE TABLE `blog_post` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `cover_url` VARCHAR(191) NULL,
    `category` ENUM('BACKEND', 'FRONTEND', 'DEVOPS', 'CAREER', 'TUTORIAL') NOT NULL DEFAULT 'TUTORIAL',
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `is_display` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `read_minutes` INTEGER NOT NULL DEFAULT 5,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `author_id` INTEGER NOT NULL,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_post_slug_key`(`slug`),
    INDEX `blog_post_status_is_display_published_at_idx`(`status`, `is_display`, `published_at`),
    INDEX `blog_post_featured_published_at_idx`(`featured`, `published_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `blog_post_tag` (
    `blog_post_id` VARCHAR(191) NOT NULL,
    `tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`blog_post_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `blog_post` ADD CONSTRAINT `blog_post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_blog_post_id_fkey` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
