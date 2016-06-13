ALTER TABLE `user_topic`
MODIFY COLUMN `access_level`  enum('read','write','admin') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL AFTER `user_id`;

