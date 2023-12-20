ALTER TABLE chats ADD `model` text DEFAULT 'llama2' NOT NULL;--> statement-breakpoint
ALTER TABLE chats ADD `baseUrl` text DEFAULT 'http://localhost:11434' NOT NULL;