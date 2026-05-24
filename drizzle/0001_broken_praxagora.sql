CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`type` text NOT NULL,
	`local_uri` text NOT NULL,
	`remote_url` text,
	`mime_type` text,
	`file_name` text,
	`file_size` integer,
	`duration` integer,
	`width` integer,
	`height` integer,
	`created_at` integer NOT NULL
);
