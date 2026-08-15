-- AlterTable
ALTER TABLE `blog_post` ADD COLUMN `featured_order` INTEGER NOT NULL DEFAULT 0;

-- Demo slider: thêm bài ghim thứ 2
UPDATE `blog_post`
SET `featured` = true, `featured_order` = 1
WHERE `slug` = 'demo-devops-nginx-pm2';

UPDATE `blog_post`
SET `featured_order` = 0
WHERE `slug` = 'demo-featured-backend-prisma';
