CREATE TABLE `news` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(55) NOT NULL COLLATE 'utf8mb4_general_ci',
	`description` VARCHAR(55) NOT NULL COLLATE 'utf8mb4_general_ci',
	`message` LONGTEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	`image_url` TEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=14
;

CREATE TABLE `news_likes` (
	`id_news` INT(11) NOT NULL,
	`identifier` VARCHAR(60) NOT NULL COLLATE 'utf8mb4_general_ci',
	INDEX `id_news` (`id_news`, `identifier`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
