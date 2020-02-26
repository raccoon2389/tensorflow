CREATE TABLE `user`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `food`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    `user_id` int(11) NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)
);
