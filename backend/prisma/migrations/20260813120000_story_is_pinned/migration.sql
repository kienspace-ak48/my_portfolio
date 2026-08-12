-- AlterTable
ALTER TABLE `story` ADD COLUMN `is_pinned` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `story_is_pinned_created_at_idx` ON `story`(`is_pinned`, `created_at`);
