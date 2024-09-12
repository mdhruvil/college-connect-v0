ALTER TABLE `college-connect_user` ADD `enrollment_no` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `college-connect_user` ADD `degree` text DEFAULT 'Not Added' NOT NULL;--> statement-breakpoint
ALTER TABLE `college-connect_user` ADD `year_of_study` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `college-connect_user` ADD `department` text DEFAULT 'Not Added' NOT NULL;