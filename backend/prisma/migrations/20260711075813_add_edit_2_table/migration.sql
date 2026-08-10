/*
  Warnings:

  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `sumary` VARCHAR(191) NULL,
    `desc` VARCHAR(191) NULL,
    `long_desc` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `is_display` BOOLEAN NOT NULL DEFAULT true,
    `finished_at` DATETIME(3) NULL,
    `demo_url` VARCHAR(191) NULL,
    `repo_url` VARCHAR(191) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `view_count` INTEGER NOT NULL DEFAULT 50,

    UNIQUE INDEX `project_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
