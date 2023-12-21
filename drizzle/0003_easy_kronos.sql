CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `chats` DROP COLUMN `model`;--> statement-breakpoint
ALTER TABLE `chats` DROP COLUMN `baseUrl`;