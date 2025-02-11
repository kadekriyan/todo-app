CREATE TABLE `addresses` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`province` varchar(255) NOT NULL,
	`postal_code` varchar(20) NOT NULL,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`firstname` varchar(255) NOT NULL,
	`lastname` varchar(255) NOT NULL,
	`birthdate` date NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;