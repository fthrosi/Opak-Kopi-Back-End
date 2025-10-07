-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `img_url` VARCHAR(255) NULL,
    `poin` INTEGER NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `verification_token` VARCHAR(255) NULL,
    `expires_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `delete_at` TIMESTAMP(0) NULL,
    `status` VARCHAR(255) NULL,

    INDEX `fk_user_role`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `user_agent` TEXT NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_refresh_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `delete_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_code` VARCHAR(255) NOT NULL,
    `customer_id` INTEGER NULL,
    `cashier_id` INTEGER NULL,
    `table_id` INTEGER NULL,
    `promo_id` INTEGER NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `cashier_name` VARCHAR(255) NULL,
    `total_price` INTEGER NOT NULL,
    `promo_value` INTEGER NULL,
    `points_value_used` INTEGER NULL,
    `payment_method` VARCHAR(20) NULL,
    `status` VARCHAR(20) NOT NULL,
    `cancellation_reason` VARCHAR(255) NULL,
    `note` VARCHAR(255) NULL,
    `is_rated` BOOLEAN NOT NULL DEFAULT false,
    `payment_url` VARCHAR(255) NULL,
    `payment_token` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `orders_order_code_key`(`order_code`),
    INDEX `fk_order_cashier`(`cashier_id`),
    INDEX `fk_order_customer`(`customer_id`),
    INDEX `fk_order_promo`(`promo_id`),
    INDEX `fk_order_table`(`table_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `menu_id` INTEGER NULL,
    `name_menu` VARCHAR(255) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price_at_transaction` INTEGER NOT NULL,
    `cogs_at_transaction` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,

    INDEX `fk_item_order`(`order_id`),
    INDEX `fk_items_menu`(`menu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `promo_code` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `img_url` VARCHAR(255) NOT NULL,
    `promo_type` VARCHAR(255) NOT NULL,
    `percent_value` INTEGER NULL,
    `amount_value` INTEGER NULL,
    `status` VARCHAR(255) NOT NULL,
    `minium_purchase` INTEGER NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `delete_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promo_menu_condition` (
    `promo_id` INTEGER NOT NULL,
    `menu_id` INTEGER NOT NULL,

    INDEX `fk_condition_menu`(`menu_id`),
    PRIMARY KEY (`promo_id`, `menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `current_price` INTEGER NOT NULL,
    `current_cogs` INTEGER NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `delete_at` TIMESTAMP(0) NULL,

    INDEX `fk_menu_kategori`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite_menu` (
    `user_id` INTEGER NOT NULL,
    `menu_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_favorit_menu`(`menu_id`),
    PRIMARY KEY (`user_id`, `menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kritik_saran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `topic` VARCHAR(255) NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `point_histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `order_id` INTEGER NULL,
    `amount` INTEGER NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `order_id`(`order_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `delete_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating_riviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `menu_id` INTEGER NOT NULL,
    `order_item_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_rating_menu`(`menu_id`),
    INDEX `fk_rating_order`(`order_item_id`),
    INDEX `fk_rating_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservation_code` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NULL,
    `reservation_time` DATETIME(0) NOT NULL,
    `number_of_guest` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `cancellation_reason` TEXT NULL,
    `checkin_code` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NOT NULL,
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_reservation_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `fk_refresh_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_order_cashier` FOREIGN KEY (`cashier_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_order_customer` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_order_promo` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_order_table` FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `fk_items_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promo_menu_condition` ADD CONSTRAINT `fk_condition_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promo_menu_condition` ADD CONSTRAINT `fk_condition_promo` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menus` ADD CONSTRAINT `fk_menu_kategori` FOREIGN KEY (`category_id`) REFERENCES `menu_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_menu` ADD CONSTRAINT `fk_favorit_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_menu` ADD CONSTRAINT `fk_favorit_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kritik_saran` ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `point_histories` ADD CONSTRAINT `fk_point_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `point_histories` ADD CONSTRAINT `fk_point_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating_riviews` ADD CONSTRAINT `fk_rating_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating_riviews` ADD CONSTRAINT `fk_rating_order` FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating_riviews` ADD CONSTRAINT `fk_rating_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `fk_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
