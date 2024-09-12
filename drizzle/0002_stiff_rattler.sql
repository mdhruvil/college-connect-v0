CREATE TABLE `college-connect_club_to_members` (
	`club_id` text(255) NOT NULL,
	`member_id` text(255) NOT NULL,
	`postition` text(255),
	PRIMARY KEY(`club_id`, `member_id`),
	FOREIGN KEY (`club_id`) REFERENCES `college-connect_clubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `college-connect_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `college-connect_clubs` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`description` text NOT NULL,
	`created_by` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`image` text(255),
	FOREIGN KEY (`created_by`) REFERENCES `college-connect_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `college-connect_event_registrations` (
	`event_id` text(255) NOT NULL,
	`member_id` text(255) NOT NULL,
	`status` text(255),
	`registered_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`event_id`, `member_id`),
	FOREIGN KEY (`event_id`) REFERENCES `college-connect_events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `college-connect_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `college-connect_events` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`description` text NOT NULL,
	`created_by` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`club_id` text(255) NOT NULL,
	`image` text(255),
	`event_date` integer NOT NULL,
	`location` text(255),
	`type` text(255),
	FOREIGN KEY (`created_by`) REFERENCES `college-connect_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`club_id`) REFERENCES `college-connect_clubs`(`id`) ON UPDATE no action ON DELETE no action
);
