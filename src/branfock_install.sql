/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Target Server Type    : MYSQL
 * Target Server Version : 50617
 * File Encoding         : 65001
 *
 * Date: 2016-05-30 07:04:36
 */

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `accesstoken`
-- ----------------------------
DROP TABLE IF EXISTS `accesstoken`;
CREATE TABLE `accesstoken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `acl`
-- ----------------------------
DROP TABLE IF EXISTS `acl`;
CREATE TABLE `acl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of acl
-- ----------------------------
INSERT INTO `acl` VALUES ('2', 'RawTopic', 'deleteById', '*', 'ALLOW', 'ROLE', '$owner');
INSERT INTO `acl` VALUES ('8', 'Topic', '*', '*', 'ALLOW', 'ROLE', 'Admin');
INSERT INTO `acl` VALUES ('9', 'RawTopic', 'deleteById', '*', 'ALLOW', 'ROLE', 'Admin');
INSERT INTO `acl` VALUES ('10', 'SettingsField', '*', '*', 'ALLOW', 'ROLE', 'Admin');
INSERT INTO `acl` VALUES ('11', 'TopicGroupScheme', '*', '*', 'ALLOW', 'ROLE', 'Admin');
INSERT INTO `acl` VALUES ('12', 'Term', '*', '*', 'ALLOW', 'ROLE', 'Admin');

-- ----------------------------
-- Table structure for `activitystream_template`
-- ----------------------------
DROP TABLE IF EXISTS `activitystream_template`;
CREATE TABLE `activitystream_template` (
  `id` varchar(100) NOT NULL,
  `summary` varchar(250) DEFAULT NULL COMMENT 'Description for admin/developer',
  `template` text,
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activitystream_template
-- ----------------------------
INSERT INTO `activitystream_template` VALUES ('topic_created', null, 'Created ${TYPE_NAME}');

-- ----------------------------
-- Table structure for `activitystream_topictype_action_template`
-- ----------------------------
DROP TABLE IF EXISTS `activitystream_topictype_action_template`;
CREATE TABLE `activitystream_topictype_action_template` (
  `topic_type_id` int(10) unsigned NOT NULL,
  `action` char(50) DEFAULT NULL,
  `activity_template_id` varchar(100) NOT NULL,
  KEY `activity_template_id` (`activity_template_id`),
  KEY `topic_type_id` (`topic_type_id`),
  CONSTRAINT `activitystream_topictype_action_template_ibfk_1` FOREIGN KEY (`activity_template_id`) REFERENCES `activitystream_template` (`id`),
  CONSTRAINT `activitystream_topictype_action_template_ibfk_2` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activitystream_topictype_action_template
-- ----------------------------
INSERT INTO `activitystream_topictype_action_template` VALUES ('9', 'CREATE', 'topic_created');

-- ----------------------------
-- Table structure for `activity_stream_entity_feed`
-- ----------------------------
DROP TABLE IF EXISTS `activity_stream_entity_feed`;
CREATE TABLE `activity_stream_entity_feed` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `stream_event_id` bigint(14) unsigned NOT NULL,
  `entity_id` bigint(14) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stream_event_id` (`stream_event_id`,`entity_id`) USING BTREE,
  KEY `entity_id` (`entity_id`),
  CONSTRAINT `activity_stream_entity_feed_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activity_stream_entity_feed
-- ----------------------------

-- ----------------------------
-- Table structure for `activity_stream_event`
-- ----------------------------
DROP TABLE IF EXISTS `activity_stream_event`;
CREATE TABLE `activity_stream_event` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `event_type` smallint(2) unsigned NOT NULL,
  `subject_entity_id` bigint(14) DEFAULT NULL,
  `object_entity_id` bigint(14) DEFAULT NULL,
  `extra_data` blob,
  `datetime` datetime DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2311 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activity_stream_event
-- ----------------------------

-- ----------------------------
-- Table structure for `activity_stream_project_feed`
-- ----------------------------
DROP TABLE IF EXISTS `activity_stream_project_feed`;
CREATE TABLE `activity_stream_project_feed` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `stream_event_id` bigint(14) unsigned NOT NULL,
  `project_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stream_event_id` (`stream_event_id`,`project_id`)
) ENGINE=MyISAM AUTO_INCREMENT=956 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activity_stream_project_feed
-- ----------------------------

-- ----------------------------
-- Table structure for `app_routes`
-- ----------------------------
DROP TABLE IF EXISTS `app_routes`;
CREATE TABLE `app_routes` (
  `id` mediumint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `path` varchar(250) NOT NULL,
  `handler` varchar(250) NOT NULL,
  `parent_id` mediumint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`,`name`),
  KEY `id` (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `app_routes_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `app_routes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of app_routes
-- ----------------------------

-- ----------------------------
-- Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(12) unsigned DEFAULT NULL,
  `thread_id` int(12) unsigned DEFAULT NULL,
  `entity_id` int(12) unsigned DEFAULT NULL,
  `author_id` int(10) unsigned DEFAULT NULL,
  `authorIp` varchar(250) DEFAULT NULL,
  `author_ip_long` int(10) NOT NULL,
  `text` text,
  `text_hash` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `created_on` datetime NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('pending','deleted','approved') DEFAULT NULL,
  `rating` float NOT NULL DEFAULT '0',
  `count_positive_votes` int(10) unsigned NOT NULL DEFAULT '0',
  `count_negative_votes` int(10) unsigned DEFAULT NULL,
  `notify_me` tinyint(1) DEFAULT NULL,
  `level` smallint(5) unsigned DEFAULT '0' COMMENT 'Comment indent level, starting from 0 as root-level',
  PRIMARY KEY (`id`),
  KEY `user_id` (`author_id`) USING BTREE,
  KEY `comment_pid` (`parent_id`) USING BTREE,
  KEY `comment_delete` (`deleted`) USING BTREE,
  KEY `rating_date_id` (`rating`,`created_on`,`id`) USING BTREE,
  KEY `comment_status` (`status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1959 DEFAULT CHARSET=utf8 COMMENT='<double-click to overwrite multiple objects>';

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for `comment_revision`
-- ----------------------------
DROP TABLE IF EXISTS `comment_revision`;
CREATE TABLE `comment_revision` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `log_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `comment_id` int(12) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `revision` smallint(3) unsigned DEFAULT '1',
  `model_data` text,
  PRIMARY KEY (`id`),
  KEY `idx_revision_comment_revision` (`comment_id`,`revision`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment_revision
-- ----------------------------

-- ----------------------------
-- Table structure for `dashboard`
-- ----------------------------
DROP TABLE IF EXISTS `dashboard`;
CREATE TABLE `dashboard` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `owner_entity_id` bigint(14) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dashboard
-- ----------------------------

-- ----------------------------
-- Table structure for `dashboard_widget`
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_widget`;
CREATE TABLE `dashboard_widget` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `widget_id` varchar(255) DEFAULT NULL,
  `dashboard_id` int(10) unsigned DEFAULT NULL,
  `block_id` int(10) unsigned DEFAULT NULL,
  `sort_ord` smallint(5) unsigned DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `params` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dashboard_widget
-- ----------------------------

-- ----------------------------
-- Table structure for `entity`
-- ----------------------------
DROP TABLE IF EXISTS `entity`;
CREATE TABLE `entity` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `owner_user_id` int(11) unsigned DEFAULT NULL,
  `access_private_yn` tinyint(3) unsigned DEFAULT '0',
  `model_pk` bigint(14) unsigned DEFAULT NULL,
  `model_class_name` varchar(50) NOT NULL,
  `model_front_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3503 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of entity
-- ----------------------------

-- ----------------------------
-- Table structure for `entity_access_assign`
-- ----------------------------
DROP TABLE IF EXISTS `entity_access_assign`;
CREATE TABLE `entity_access_assign` (
  `auth_id` int(11) NOT NULL,
  `auth_type` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `entity_id` bigint(14) unsigned NOT NULL,
  `level` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`auth_type`,`auth_id`,`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of entity_access_assign
-- ----------------------------

-- ----------------------------
-- Table structure for `entity_available_feature`
-- ----------------------------
DROP TABLE IF EXISTS `entity_available_feature`;
CREATE TABLE `entity_available_feature` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `entity_menu_id` int(11) unsigned NOT NULL,
  `link` varchar(250) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `topic_group_id` int(11) DEFAULT NULL,
  `topic_type_id` int(11) DEFAULT NULL,
  `topic_user_filter_id` int(11) DEFAULT NULL,
  `label` varchar(250) DEFAULT NULL,
  `label_language` char(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_menu_id` (`entity_menu_id`),
  CONSTRAINT `entity_available_feature_ibfk_1` FOREIGN KEY (`entity_menu_id`) REFERENCES `entity_menu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of entity_available_feature
-- ----------------------------

-- ----------------------------
-- Table structure for `entity_feature`
-- ----------------------------
DROP TABLE IF EXISTS `entity_feature`;
CREATE TABLE `entity_feature` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` bigint(14) unsigned NOT NULL,
  `summary` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`,`entity_id`),
  KEY `entity_id` (`entity_id`),
  KEY `id` (`id`),
  CONSTRAINT `entity_feature_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of entity_feature
-- ----------------------------

-- ----------------------------
-- Table structure for `entity_menu`
-- ----------------------------
DROP TABLE IF EXISTS `entity_menu`;
CREATE TABLE `entity_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` bigint(14) unsigned NOT NULL,
  `summary` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`,`entity_id`),
  KEY `entity_id` (`entity_id`),
  KEY `id` (`id`),
  CONSTRAINT `entity_menu_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of entity_menu
-- ----------------------------

-- ----------------------------
-- Table structure for `entity_menu_item`
-- ----------------------------
DROP TABLE IF EXISTS `entity_menu_item`;
CREATE TABLE `entity_menu_item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `entity_menu_id` int(11) unsigned NOT NULL,
  `link` varchar(250) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `topic_group_id` int(11) DEFAULT NULL,
  `topic_type_id` int(11) DEFAULT NULL,
  `topic_user_filter_id` int(11) DEFAULT NULL,
  `label` varchar(250) DEFAULT NULL,
  `label_language` char(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_menu_id` (`entity_menu_id`),
  CONSTRAINT `entity_menu_item_ibfk_1` FOREIGN KEY (`entity_menu_id`) REFERENCES `entity_menu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of entity_menu_item
-- ----------------------------

-- ----------------------------
-- Table structure for `entity_workflow_operation`
-- ----------------------------
DROP TABLE IF EXISTS `entity_workflow_operation`;
CREATE TABLE `entity_workflow_operation` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` bigint(14) unsigned NOT NULL,
  `workflow_operation_id` int(10) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `in_stage_id` int(11) unsigned NOT NULL,
  `out_stage_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_id` (`entity_id`),
  KEY `workflow_operation_id` (`workflow_operation_id`),
  KEY `user_id` (`user_id`),
  KEY `in_stage_id` (`in_stage_id`),
  KEY `out_stage_id` (`out_stage_id`),
  CONSTRAINT `entity_workflow_operation_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_workflow_operation_ibfk_2` FOREIGN KEY (`workflow_operation_id`) REFERENCES `workflow_operation` (`id`),
  CONSTRAINT `entity_workflow_operation_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `entity_workflow_operation_ibfk_4` FOREIGN KEY (`in_stage_id`) REFERENCES `workflow_stage` (`id`),
  CONSTRAINT `entity_workflow_operation_ibfk_5` FOREIGN KEY (`out_stage_id`) REFERENCES `workflow_stage` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of entity_workflow_operation
-- ----------------------------

-- ----------------------------
-- Table structure for `field`
-- ----------------------------
DROP TABLE IF EXISTS `field`;
CREATE TABLE `field` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `filter_type` enum('date','daterange','select','multiselect','text') DEFAULT 'text',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of field
-- ----------------------------
INSERT INTO `field` VALUES ('1', 'fixVersion', 'Fixes Version(s)', 'multiselect');
INSERT INTO `field` VALUES ('2', 'affectsVersion', 'Affects Version', 'multiselect');
INSERT INTO `field` VALUES ('3', 'component', 'Component(s)', 'multiselect');
INSERT INTO `field` VALUES ('4', 'assignee', 'Assignee', 'select');
INSERT INTO `field` VALUES ('5', 'reporter', 'Reporter', 'select');
INSERT INTO `field` VALUES ('6', 'businessValue', 'Business Value', null);
INSERT INTO `field` VALUES ('7', 'comment', 'Comment', null);
INSERT INTO `field` VALUES ('8', 'dueDate', 'Due Date', 'date');
INSERT INTO `field` VALUES ('9', 'environment', 'Environment', 'text');
INSERT INTO `field` VALUES ('10', 'epic_link', 'Epic Link', 'multiselect');
INSERT INTO `field` VALUES ('11', 'typeId_', 'Issue Type', 'multiselect');
INSERT INTO `field` VALUES ('12', 'labels', 'Labels', 'multiselect');
INSERT INTO `field` VALUES ('13', 'linked_issues', 'Linked Issues', 'multiselect');
INSERT INTO `field` VALUES ('14', 'priorityId', 'Priority', 'select');
INSERT INTO `field` VALUES ('15', 'version_history', 'Version History', null);
INSERT INTO `field` VALUES ('16', 'resolution', 'Resolution', 'text');
INSERT INTO `field` VALUES ('17', 'sprint', 'Sprint', 'multiselect');
INSERT INTO `field` VALUES ('18', 'summary', 'Summary', 'text');
INSERT INTO `field` VALUES ('19', 'logo_icon', 'Icon CSS selector name (Font Awesome)', 'text');
INSERT INTO `field` VALUES ('20', 'logo_background', 'Icon background color code from colors.js', 'text');
INSERT INTO `field` VALUES ('21', 'contextTopicId', null, 'select');
INSERT INTO `field` VALUES ('22', 'text', 'Details', 'text');
INSERT INTO `field` VALUES ('23', 'contextTopicKey', 'Key (code)', 'text');
INSERT INTO `field` VALUES ('25', 'groupSchemeId', 'Group Scheme', 'select');
INSERT INTO `field` VALUES ('26', 'parentTopicId', '%ParentGroupName%', 'select');
INSERT INTO `field` VALUES ('27', 'contextTopicParentId', null, 'text');

-- ----------------------------
-- Table structure for `filter_field`
-- ----------------------------
DROP TABLE IF EXISTS `filter_field`;
CREATE TABLE `filter_field` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `filed_key` int(11) unsigned NOT NULL,
  `sort_weight` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of filter_field
-- ----------------------------

-- ----------------------------
-- Table structure for `filter_preset`
-- ----------------------------
DROP TABLE IF EXISTS `filter_preset`;
CREATE TABLE `filter_preset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `preset_key` varchar(100) NOT NULL,
  `summary` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of filter_preset
-- ----------------------------
INSERT INTO `filter_preset` VALUES ('1', '', null);

-- ----------------------------
-- Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('2', 'Admin', null, '2015-10-25 21:10:49', '2015-10-25 21:10:49');
INSERT INTO `role` VALUES ('4', 'allowUpdateTopics', null, null, null);
INSERT INTO `role` VALUES ('6', 'Test', null, null, null);

-- ----------------------------
-- Table structure for `rolemapping`
-- ----------------------------
DROP TABLE IF EXISTS `rolemapping`;
CREATE TABLE `rolemapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rolemapping
-- ----------------------------
INSERT INTO `rolemapping` VALUES ('2', 'USER', '12', '2');
INSERT INTO `rolemapping` VALUES ('6', 'USER', '12', '6');

-- ----------------------------
-- Table structure for `screen`
-- ----------------------------
DROP TABLE IF EXISTS `screen`;
CREATE TABLE `screen` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of screen
-- ----------------------------
INSERT INTO `screen` VALUES ('1', null, 'Default Issue Create Form');
INSERT INTO `screen` VALUES ('2', null, 'Default Board Topic Form');
INSERT INTO `screen` VALUES ('3', null, 'Create context board form');
INSERT INTO `screen` VALUES ('4', null, 'Default Project Form');
INSERT INTO `screen` VALUES ('5', null, 'Create root board');
INSERT INTO `screen` VALUES ('6', null, 'Create Opportunity Form');

-- ----------------------------
-- Table structure for `screen_field`
-- ----------------------------
DROP TABLE IF EXISTS `screen_field`;
CREATE TABLE `screen_field` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `screen_id` int(10) unsigned NOT NULL,
  `field_id` int(10) unsigned NOT NULL,
  `sort_weight` smallint(5) unsigned DEFAULT NULL COMMENT 'heavier on top',
  `is_required` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `screen_id` (`screen_id`),
  KEY `field_id` (`field_id`),
  CONSTRAINT `screen_field_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `screen` (`id`),
  CONSTRAINT `screen_field_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of screen_field
-- ----------------------------
INSERT INTO `screen_field` VALUES ('1', '1', '18', '90', '0');
INSERT INTO `screen_field` VALUES ('2', '1', '4', null, '0');
INSERT INTO `screen_field` VALUES ('3', '1', '8', null, '0');
INSERT INTO `screen_field` VALUES ('4', '3', '9', '1', '0');
INSERT INTO `screen_field` VALUES ('5', '1', '12', null, '0');
INSERT INTO `screen_field` VALUES ('6', '1', '13', null, '0');
INSERT INTO `screen_field` VALUES ('7', '1', '14', '50', '0');
INSERT INTO `screen_field` VALUES ('8', '1', '16', null, '0');
INSERT INTO `screen_field` VALUES ('9', '1', '21', '300', '0');
INSERT INTO `screen_field` VALUES ('10', '1', '11', '100', '0');
INSERT INTO `screen_field` VALUES ('11', '1', '22', '80', '0');
INSERT INTO `screen_field` VALUES ('12', '2', '18', '100', '0');
INSERT INTO `screen_field` VALUES ('15', '3', '21', null, '0');
INSERT INTO `screen_field` VALUES ('16', '4', '18', '90', '0');
INSERT INTO `screen_field` VALUES ('17', '4', '23', null, '0');
INSERT INTO `screen_field` VALUES ('21', '2', '22', null, '0');
INSERT INTO `screen_field` VALUES ('22', '4', '25', '500', '0');
INSERT INTO `screen_field` VALUES ('23', '3', '18', null, '0');
INSERT INTO `screen_field` VALUES ('24', '2', '26', '500', '0');
INSERT INTO `screen_field` VALUES ('25', '3', '27', '100', '0');
INSERT INTO `screen_field` VALUES ('26', '5', '27', '100', '0');
INSERT INTO `screen_field` VALUES ('27', '5', '18', '200', '0');
INSERT INTO `screen_field` VALUES ('29', '5', '23', null, '0');
INSERT INTO `screen_field` VALUES ('30', '6', '18', '100', '0');

-- ----------------------------
-- Table structure for `screen_scheme`
-- ----------------------------
DROP TABLE IF EXISTS `screen_scheme`;
CREATE TABLE `screen_scheme` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int(10) unsigned DEFAULT NULL,
  `default_screen_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `default_screen_id` (`default_screen_id`),
  CONSTRAINT `screen_scheme_ibfk_1` FOREIGN KEY (`default_screen_id`) REFERENCES `screen` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of screen_scheme
-- ----------------------------
INSERT INTO `screen_scheme` VALUES ('1', '1', null, 'Default Scheme For Issues', 'Describes which screens will show for certain topic_type');
INSERT INTO `screen_scheme` VALUES ('2', '3', null, 'board', null);
INSERT INTO `screen_scheme` VALUES ('3', '19', null, 'contextBoard', null);
INSERT INTO `screen_scheme` VALUES ('4', '9', '4', 'New Project', 'Create project form');
INSERT INTO `screen_scheme` VALUES ('5', '4', null, 'Board Topic', null);
INSERT INTO `screen_scheme` VALUES ('6', '10', '6', 'Opportunity', null);

-- ----------------------------
-- Table structure for `screen_scheme_topic_type_screen_map`
-- ----------------------------
DROP TABLE IF EXISTS `screen_scheme_topic_type_screen_map`;
CREATE TABLE `screen_scheme_topic_type_screen_map` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `screen_scheme_id` int(11) unsigned DEFAULT NULL,
  `topic_type_id` int(10) unsigned DEFAULT NULL,
  `screen_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `screen_scheme_id` (`screen_scheme_id`),
  KEY `topic_type_id` (`topic_type_id`),
  KEY `screen_id` (`screen_id`),
  CONSTRAINT `screen_scheme_topic_type_screen_map_ibfk_1` FOREIGN KEY (`screen_scheme_id`) REFERENCES `screen_scheme` (`id`),
  CONSTRAINT `screen_scheme_topic_type_screen_map_ibfk_2` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  CONSTRAINT `screen_scheme_topic_type_screen_map_ibfk_3` FOREIGN KEY (`screen_id`) REFERENCES `screen` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of screen_scheme_topic_type_screen_map
-- ----------------------------
INSERT INTO `screen_scheme_topic_type_screen_map` VALUES ('1', '1', '1', '1');
INSERT INTO `screen_scheme_topic_type_screen_map` VALUES ('2', '2', '12', '5');
INSERT INTO `screen_scheme_topic_type_screen_map` VALUES ('3', '3', '12', '3');
INSERT INTO `screen_scheme_topic_type_screen_map` VALUES ('4', '4', '5', '4');
INSERT INTO `screen_scheme_topic_type_screen_map` VALUES ('5', '5', '9', '2');
INSERT INTO `screen_scheme_topic_type_screen_map` VALUES ('6', '4', '18', '4');

-- ----------------------------
-- Table structure for `sequence`
-- ----------------------------
DROP TABLE IF EXISTS `sequence`;
CREATE TABLE `sequence` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `owner_topic_id` bigint(14) unsigned NOT NULL COMMENT 'Entity that owns the sequence',
  `topic_group_id` int(10) unsigned NOT NULL,
  `counter` smallint(5) unsigned NOT NULL DEFAULT '0',
  `is_ordered` tinyint(1) NOT NULL DEFAULT '1',
  `format` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `owner_topic_id` (`owner_topic_id`,`topic_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=515 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sequence
-- ----------------------------

-- ----------------------------
-- Table structure for `settings`
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(64) NOT NULL DEFAULT 'system',
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `serialize_policy` enum('php','json') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_key` (`category`,`key`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of settings
-- ----------------------------

-- ----------------------------
-- Table structure for `settings_field`
-- ----------------------------
DROP TABLE IF EXISTS `settings_field`;
CREATE TABLE `settings_field` (
  `category_key` varchar(250) NOT NULL,
  `id` varchar(100) NOT NULL,
  `label` varchar(250) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `sort_weight` smallint(5) unsigned DEFAULT NULL,
  `type` enum('date','text','textarea','select','multiselect','checkbox','radio') DEFAULT NULL,
  PRIMARY KEY (`id`,`category_key`),
  UNIQUE KEY `id` (`id`,`category_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of settings_field
-- ----------------------------
INSERT INTO `settings_field` VALUES ('wkd.auth', 'disabledRegistrationMessage', 'Message when registration is disabled', null, '19', 'textarea');
INSERT INTO `settings_field` VALUES ('wkd.auth', 'enableExtendedLoginProvider', 'Allow to sign in/up via Auth providers like Google, Facebook etc.', null, null, 'checkbox');
INSERT INTO `settings_field` VALUES ('wkd.auth', 'enableRegistration', 'Allow guests to create accounts', null, '20', 'checkbox');
INSERT INTO `settings_field` VALUES ('bfk.general', 'guestAccessAllowed', 'Allow Guest Access', 'Users always prompted to login if this is turned off', '10', 'checkbox');
INSERT INTO `settings_field` VALUES ('wkd.auth', 'minPasswordLength', 'Minimal password length', null, null, 'text');
INSERT INTO `settings_field` VALUES ('wkd.auth', 'signInCaptcha', 'Login captcha', null, null, 'checkbox');
INSERT INTO `settings_field` VALUES ('wkd.auth', 'signUpCaptcha', 'Sign up captcha', null, null, 'checkbox');
INSERT INTO `settings_field` VALUES ('wkd.auth', 'signUpRequireDisplayName', 'Require to create \"Display Name\" on sign up', null, null, 'checkbox');
INSERT INTO `settings_field` VALUES ('wkd.auth', 'signUpUsernameIsNotEmail', 'Require to create username on sign up', null, null, 'checkbox');

-- ----------------------------
-- Table structure for `term`
-- ----------------------------
DROP TABLE IF EXISTS `term`;
CREATE TABLE `term` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(32) DEFAULT NULL,
  `workspace_id` int(11) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `label_config` blob COMMENT 'JSON',
  `has_custom_value_configs` tinyint(1) unsigned DEFAULT '0',
  `hotkey_path` char(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `workspace_id` (`workspace_id`),
  CONSTRAINT `term_ibfk_1` FOREIGN KEY (`workspace_id`) REFERENCES `workspace` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of term
-- ----------------------------
INSERT INTO `term` VALUES ('1', 'status', null, 'Status', null, '0', '>');
INSERT INTO `term` VALUES ('5', 'priority', null, 'Priority', null, '0', '!');
INSERT INTO `term` VALUES ('6', 'label', null, 'Label', null, '0', '#');

-- ----------------------------
-- Table structure for `term_value`
-- ----------------------------
DROP TABLE IF EXISTS `term_value`;
CREATE TABLE `term_value` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `term_id` int(10) unsigned NOT NULL,
  `value` varchar(255) NOT NULL,
  `label_config` mediumblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of term_value
-- ----------------------------
INSERT INTO `term_value` VALUES ('1', '1', 'Backlog', null);
INSERT INTO `term_value` VALUES ('2', '1', 'In Progress', null);
INSERT INTO `term_value` VALUES ('3', '1', 'Closed', null);
INSERT INTO `term_value` VALUES ('4', '1', 'Open', null);
INSERT INTO `term_value` VALUES ('5', '5', 'Blocker', 0x7B22636C72223A22726564363030227D);
INSERT INTO `term_value` VALUES ('7', '5', 'Important', 0x7B22636C72223A22726564363030227D);
INSERT INTO `term_value` VALUES ('8', '5', 'Low', null);
INSERT INTO `term_value` VALUES ('9', '5', 'Regular', null);

-- ----------------------------
-- Table structure for `topic`
-- ----------------------------
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` bigint(14) unsigned DEFAULT NULL,
  `owner_namespace` varchar(255) DEFAULT NULL,
  `workspace_id` int(11) unsigned NOT NULL,
  `context_topic_id` bigint(14) unsigned DEFAULT NULL COMMENT 'Context of this issue, e.g. project id',
  `parent_topic_id` bigint(14) unsigned DEFAULT '0' COMMENT 'link to topic category/section, or parent issue',
  `group_id` int(10) unsigned DEFAULT NULL,
  `context_topic_key` varchar(100) DEFAULT NULL,
  `context_topic_num` smallint(5) unsigned DEFAULT NULL,
  `type_id` int(10) unsigned DEFAULT NULL,
  `group_scheme_id` int(10) unsigned DEFAULT NULL,
  `milestone_topic_id` int(11) DEFAULT NULL,
  `workflow_stage_id` int(11) unsigned DEFAULT NULL,
  `status` enum('closed','open','progress') DEFAULT 'open' COMMENT 'open - new issue, progress - issue is being worked on, closed - issue is closed',
  `closed_yn` tinyint(1) unsigned DEFAULT '0',
  `closed_on` datetime DEFAULT NULL,
  `deleted_yn` tinyint(1) unsigned DEFAULT '0',
  `deleted_on` datetime DEFAULT NULL,
  `sort_order` smallint(5) unsigned DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `count_comments` smallint(5) unsigned NOT NULL DEFAULT '0',
  `owner_user_id` int(10) unsigned DEFAULT NULL,
  `access_private_yn` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `assigned_user_id` int(10) unsigned DEFAULT NULL,
  `submitted_user_id` int(10) DEFAULT NULL,
  `priority_id` int(10) unsigned DEFAULT '0' COMMENT '0-4 priority, 4 is the highest',
  `text` text,
  `submitted_on` datetime DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_date` datetime DEFAULT NULL,
  `logo_icon` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `logo_background` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `completed_percentage` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `context_topic_id` (`context_topic_id`,`context_topic_key`),
  UNIQUE KEY `context_topic_id_2` (`context_topic_id`,`context_topic_num`,`group_id`),
  KEY `deleted_yn` (`deleted_yn`,`context_topic_id`,`closed_yn`,`owner_user_id`,`access_private_yn`) USING BTREE,
  KEY `type_id` (`type_id`) USING BTREE,
  KEY `workflow_stage_id` (`workflow_stage_id`) USING BTREE,
  KEY `entity_id` (`entity_id`),
  KEY `group_scheme_id` (`group_scheme_id`),
  KEY `workspace_id` (`workspace_id`),
  CONSTRAINT `topic_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `topic_type` (`id`),
  CONSTRAINT `topic_ibfk_2` FOREIGN KEY (`workflow_stage_id`) REFERENCES `workflow_stage` (`id`),
  CONSTRAINT `topic_ibfk_3` FOREIGN KEY (`context_topic_id`) REFERENCES `topic` (`id`),
  CONSTRAINT `topic_ibfk_4` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `topic_ibfk_5` FOREIGN KEY (`group_scheme_id`) REFERENCES `topic_group_scheme` (`id`),
  CONSTRAINT `topic_ibfk_6` FOREIGN KEY (`workspace_id`) REFERENCES `workspace` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=719 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_category`
-- ----------------------------
DROP TABLE IF EXISTS `topic_category`;
CREATE TABLE `topic_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `group_id` int(10) unsigned NOT NULL,
  `order_in_group` mediumint(6) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Topic category is like a folder for topic, based on group';

-- ----------------------------
-- Records of topic_category
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_context`
-- ----------------------------
DROP TABLE IF EXISTS `topic_context`;
CREATE TABLE `topic_context` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `owner_namespace` varchar(255) DEFAULT NULL,
  `workspace_id` int(11) unsigned NOT NULL,
  `milestone_topic_id` int(11) DEFAULT NULL,
  `entity_id` bigint(14) unsigned DEFAULT NULL,
  `group_scheme_id` int(10) unsigned DEFAULT NULL,
  `group_id` int(10) unsigned DEFAULT NULL,
  `type_id` int(10) unsigned DEFAULT NULL,
  `workflow_stage_id` int(11) unsigned DEFAULT NULL,
  `status` enum('closed','open','progress') DEFAULT 'open' COMMENT 'open - new issue, progress - issue is being worked on, closed - issue is closed',
  `closed_yn` tinyint(1) unsigned DEFAULT '0',
  `closed_on` datetime DEFAULT NULL,
  `deleted_yn` tinyint(1) unsigned DEFAULT '0',
  `deleted_on` datetime DEFAULT NULL,
  `parent_topic_id` bigint(14) unsigned DEFAULT '0' COMMENT 'link to topic category/section, or parent issue',
  `sort_order` smallint(5) unsigned DEFAULT NULL,
  `context_topic_num` smallint(5) unsigned DEFAULT NULL,
  `context_topic_key` varchar(100) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `count_comments` smallint(5) unsigned NOT NULL DEFAULT '0',
  `owner_user_id` int(10) unsigned DEFAULT NULL,
  `access_private_yn` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `assigned_user_id` int(10) unsigned DEFAULT NULL,
  `submitted_user_id` int(10) DEFAULT NULL,
  `priority` tinyint(1) unsigned DEFAULT '0' COMMENT '0-4 priority, 4 is the highest',
  `text` text,
  `submitted_on` datetime DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_date` datetime DEFAULT NULL,
  `_stream_id` int(10) unsigned DEFAULT NULL,
  `logo_icon` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `logo_background` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `completed_percentage` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`) USING BTREE,
  KEY `workflow_stage_id` (`workflow_stage_id`) USING BTREE,
  KEY `entity_id` (`entity_id`),
  KEY `group_scheme_id` (`group_scheme_id`),
  KEY `workspace_id` (`workspace_id`),
  CONSTRAINT `topic_context_ibfk_1` FOREIGN KEY (`workspace_id`) REFERENCES `workspace` (`id`),
  CONSTRAINT `topic_context_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `topic_type` (`id`),
  CONSTRAINT `topic_context_ibfk_3` FOREIGN KEY (`workflow_stage_id`) REFERENCES `workflow_stage` (`id`),
  CONSTRAINT `topic_context_ibfk_4` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `topic_context_ibfk_5` FOREIGN KEY (`group_scheme_id`) REFERENCES `topic_group_scheme` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=477 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_context
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_field_value`
-- ----------------------------
DROP TABLE IF EXISTS `topic_field_value`;
CREATE TABLE `topic_field_value` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` bigint(14) unsigned NOT NULL,
  `field_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_field_value
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_group`
-- ----------------------------
DROP TABLE IF EXISTS `topic_group`;
CREATE TABLE `topic_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_group_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `group_key` varchar(255) DEFAULT NULL,
  `has_sequence_yn` tinyint(1) unsigned DEFAULT NULL,
  `sequence_id` bigint(20) unsigned DEFAULT NULL,
  `context_yn` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'topics in such groups provide link to topic_type_scheme',
  `router_path` varchar(100) DEFAULT NULL,
  `permalink` varchar(100) DEFAULT NULL,
  `view` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_group
-- ----------------------------
INSERT INTO `topic_group` VALUES ('1', '9', 'Issue', 'Issues, Tasks etc', 'issue', '1', null, '0', 'issues', '/:namespace/:board_key/:topic_key', 'master.detail');
INSERT INTO `topic_group` VALUES ('3', null, 'Boards', 'Discussion Board ', 'board', '0', null, '1', '/boards', '/board/:id/:topic_key', 'list');
INSERT INTO `topic_group` VALUES ('4', '3', 'Board Topic', 'Discussion Board topic', 'board_topic', '0', null, '0', null, '/board/:context_id/:board_key/:id/:topic_key', 'list');
INSERT INTO `topic_group` VALUES ('7', null, 'Project Release', null, null, '0', null, '0', null, null, 'master.detail');
INSERT INTO `topic_group` VALUES ('8', null, 'Milestones', 'Versions, Milestones', 'plan', '0', null, '0', null, '/project/:board_key/milestones/:id', 'master.detail');
INSERT INTO `topic_group` VALUES ('9', null, 'Projects', 'Projects', 'project', '0', null, '1', '/projects', '/:namespace/:topic_key', 'master.detail');
INSERT INTO `topic_group` VALUES ('10', null, 'Opportunities', 'Deals with clients, leads', 'opportunity', '0', null, '0', null, null, 'master.detail');
INSERT INTO `topic_group` VALUES ('11', null, 'Message', null, 'message', '0', null, '0', null, null, 'master.detail');
INSERT INTO `topic_group` VALUES ('12', null, 'Event', 'Calendar Events & Meetings (reserved)', 'event', '0', null, '0', null, null, 'calendar');
INSERT INTO `topic_group` VALUES ('13', '9', 'Version', 'Application version', 'version', '0', null, '0', null, null, 'master.detail');
INSERT INTO `topic_group` VALUES ('14', '9', 'Component', 'Component', 'component', '0', null, '0', null, null, 'master.detail');
INSERT INTO `topic_group` VALUES ('19', '9', 'Discussion Board', null, 'contextBoard', '0', null, '0', null, '/board/:id/:board_key', 'master.detail');
INSERT INTO `topic_group` VALUES ('20', null, 'Lecture', null, 'lectures', null, null, '0', null, null, null);

-- ----------------------------
-- Table structure for `topic_group_scheme`
-- ----------------------------
DROP TABLE IF EXISTS `topic_group_scheme`;
CREATE TABLE `topic_group_scheme` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `root_group_id` int(10) unsigned NOT NULL COMMENT 'Main group in this scheme. only topics in that group will have be given prefix in `contextTopicKey` value',
  PRIMARY KEY (`id`),
  KEY `is_default` (`is_default`),
  KEY `root_group_id` (`root_group_id`),
  CONSTRAINT `topic_group_scheme_ibfk_1` FOREIGN KEY (`root_group_id`) REFERENCES `topic_group` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='This is a set of issue types that project has';

-- ----------------------------
-- Records of topic_group_scheme
-- ----------------------------
INSERT INTO `topic_group_scheme` VALUES ('1', 'Software Development', '1', '1');
INSERT INTO `topic_group_scheme` VALUES ('2', 'Sales Management', '1', '10');
INSERT INTO `topic_group_scheme` VALUES ('4', 'Educational Initiative', '0', '1');
INSERT INTO `topic_group_scheme` VALUES ('6', 'Community Boards', '0', '1');
INSERT INTO `topic_group_scheme` VALUES ('7', 'Projects', '1', '9');

-- ----------------------------
-- Table structure for `topic_group_scheme_group_map`
-- ----------------------------
DROP TABLE IF EXISTS `topic_group_scheme_group_map`;
CREATE TABLE `topic_group_scheme_group_map` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_group_scheme_id` int(11) unsigned NOT NULL,
  `topic_group_id` int(11) unsigned NOT NULL,
  `available_sub_group_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_group_scheme_group_map
-- ----------------------------
INSERT INTO `topic_group_scheme_group_map` VALUES ('1', '1', '1', '1');
INSERT INTO `topic_group_scheme_group_map` VALUES ('2', '1', '19', '3');
INSERT INTO `topic_group_scheme_group_map` VALUES ('3', '1', '9', '4');
INSERT INTO `topic_group_scheme_group_map` VALUES ('4', '1', '3', '2');
INSERT INTO `topic_group_scheme_group_map` VALUES ('5', '1', '4', '5');
INSERT INTO `topic_group_scheme_group_map` VALUES ('6', '1', '9', '1');
INSERT INTO `topic_group_scheme_group_map` VALUES ('7', '2', '10', '0');
INSERT INTO `topic_group_scheme_group_map` VALUES ('8', '6', '3', '2');

-- ----------------------------
-- Table structure for `topic_group_scheme_type_scheme_map`
-- ----------------------------
DROP TABLE IF EXISTS `topic_group_scheme_type_scheme_map`;
CREATE TABLE `topic_group_scheme_type_scheme_map` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_group_scheme_id` int(11) unsigned NOT NULL,
  `topic_group_id` int(11) unsigned NOT NULL,
  `topic_type_scheme_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_group_scheme_type_scheme_map
-- ----------------------------
INSERT INTO `topic_group_scheme_type_scheme_map` VALUES ('1', '1', '1', '1');
INSERT INTO `topic_group_scheme_type_scheme_map` VALUES ('2', '1', '19', '3');
INSERT INTO `topic_group_scheme_type_scheme_map` VALUES ('3', '7', '9', '4');
INSERT INTO `topic_group_scheme_type_scheme_map` VALUES ('4', '1', '3', '2');
INSERT INTO `topic_group_scheme_type_scheme_map` VALUES ('5', '1', '4', '5');
INSERT INTO `topic_group_scheme_type_scheme_map` VALUES ('7', '2', '10', '6');
INSERT INTO `topic_group_scheme_type_scheme_map` VALUES ('8', '6', '3', '2');

-- ----------------------------
-- Table structure for `topic_instance_group_scheme`
-- ----------------------------
DROP TABLE IF EXISTS `topic_instance_group_scheme`;
CREATE TABLE `topic_instance_group_scheme` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` bigint(14) unsigned NOT NULL,
  `topic_group_id` int(11) unsigned NOT NULL,
  `topic_type_scheme_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_instance_group_scheme
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_instance_menu`
-- ----------------------------
DROP TABLE IF EXISTS `topic_instance_menu`;
CREATE TABLE `topic_instance_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` bigint(14) unsigned NOT NULL,
  `topic_group_id` int(11) unsigned NOT NULL,
  `topic_type_scheme_id` int(11) unsigned DEFAULT NULL,
  `permalink` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_instance_menu
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_menu_item`
-- ----------------------------
DROP TABLE IF EXISTS `topic_menu_item`;
CREATE TABLE `topic_menu_item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` int(11) unsigned NOT NULL,
  `link` varchar(250) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `topic_group_id` int(11) DEFAULT NULL,
  `topic_type_id` int(11) DEFAULT NULL,
  `topic_user_filter_id` int(11) DEFAULT NULL,
  `label` varchar(250) DEFAULT NULL,
  `label_language` char(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_menu_id` (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_menu_item
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_tag`
-- ----------------------------
DROP TABLE IF EXISTS `topic_tag`;
CREATE TABLE `topic_tag` (
  `topic_id` bigint(14) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  UNIQUE KEY `tag_ticket` (`topic_id`,`tag_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_tag
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_topic_type_scheme_assoc`
-- ----------------------------
DROP TABLE IF EXISTS `topic_topic_type_scheme_assoc`;
CREATE TABLE `topic_topic_type_scheme_assoc` (
  `topic_id` bigint(14) unsigned NOT NULL,
  `topic_type_scheme_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`topic_id`,`topic_type_scheme_id`),
  KEY `topic_type_scheme_id` (`topic_type_scheme_id`),
  CONSTRAINT `topic_topic_type_scheme_assoc_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`),
  CONSTRAINT `topic_topic_type_scheme_assoc_ibfk_2` FOREIGN KEY (`topic_type_scheme_id`) REFERENCES `topic_type_scheme` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_topic_type_scheme_assoc
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_type`
-- ----------------------------
DROP TABLE IF EXISTS `topic_type`;
CREATE TABLE `topic_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `alias` char(30) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `topic_group_id` int(10) unsigned NOT NULL,
  `allow_subtopics_yn` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `allow_comments_yn` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `label_config` blob,
  PRIMARY KEY (`id`),
  KEY `topic_group_id` (`topic_group_id`) USING BTREE,
  CONSTRAINT `topic_type_ibfk_1` FOREIGN KEY (`topic_group_id`) REFERENCES `topic_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_type
-- ----------------------------
INSERT INTO `topic_type` VALUES ('1', 'issue', 'Task', null, '1', '0', '1', null);
INSERT INTO `topic_type` VALUES ('2', 'bug', 'Bug', null, '1', '0', '1', 0x7B226267223A22726564363030222C22636C72223A227265643530227D);
INSERT INTO `topic_type` VALUES ('3', 'epic', 'Epic', 'A big user story thatshould be broken down', '1', '0', '1', null);
INSERT INTO `topic_type` VALUES ('4', 'milestone', 'Milestone', null, '8', '0', '1', null);
INSERT INTO `topic_type` VALUES ('5', 'project', 'Project', null, '9', '1', '0', null);
INSERT INTO `topic_type` VALUES ('7', 'version', 'Version', 'Versions can be released/archived', '13', '0', '0', null);
INSERT INTO `topic_type` VALUES ('8', 'announcement', 'Announcements', null, '4', '0', '0', null);
INSERT INTO `topic_type` VALUES ('9', 'board_topic', 'Discussion Topic', '', '4', '0', '1', null);
INSERT INTO `topic_type` VALUES ('10', 'supportTopic', 'Tech Support Question', null, '4', '0', '0', null);
INSERT INTO `topic_type` VALUES ('12', 'board', 'Discussion Board', null, '3', '1', '0', null);
INSERT INTO `topic_type` VALUES ('15', 'project_category', 'Project Category', null, '9', '0', '0', null);
INSERT INTO `topic_type` VALUES ('16', 'improvement', 'Improvement', null, '1', '0', '1', null);
INSERT INTO `topic_type` VALUES ('17', 'feature', 'New Feature', null, '1', '0', '1', null);
INSERT INTO `topic_type` VALUES ('18', 'sales', 'Sales Activity', 'Sales activity', '9', '1', '0', null);
INSERT INTO `topic_type` VALUES ('20', 'category', 'Category', null, '3', '1', '0', null);

-- ----------------------------
-- Table structure for `topic_type_scheme`
-- ----------------------------
DROP TABLE IF EXISTS `topic_type_scheme`;
CREATE TABLE `topic_type_scheme` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='This is a set of issue types that project has';

-- ----------------------------
-- Records of topic_type_scheme
-- ----------------------------
INSERT INTO `topic_type_scheme` VALUES ('1', 'Software Development Default', null);
INSERT INTO `topic_type_scheme` VALUES ('2', 'Discussion Boards default', null);
INSERT INTO `topic_type_scheme` VALUES ('3', 'contextBoard', null);
INSERT INTO `topic_type_scheme` VALUES ('4', 'Projects', null);
INSERT INTO `topic_type_scheme` VALUES ('5', 'Board Topics', null);
INSERT INTO `topic_type_scheme` VALUES ('6', 'Sales Activity Default', null);

-- ----------------------------
-- Table structure for `topic_type_scheme_topic_type_map`
-- ----------------------------
DROP TABLE IF EXISTS `topic_type_scheme_topic_type_map`;
CREATE TABLE `topic_type_scheme_topic_type_map` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_type_scheme_id` int(10) unsigned NOT NULL,
  `topic_type_id` int(10) unsigned NOT NULL,
  `sort_weight` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'order of type in scheme, heaviest on top',
  PRIMARY KEY (`id`),
  KEY `topic_type_id` (`topic_type_id`) USING BTREE,
  KEY `topic_type_scheme_id` (`topic_type_scheme_id`) USING BTREE,
  CONSTRAINT `topic_type_scheme_topic_type_map_ibfk_1` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  CONSTRAINT `topic_type_scheme_topic_type_map_ibfk_2` FOREIGN KEY (`topic_type_scheme_id`) REFERENCES `topic_type_scheme` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_type_scheme_topic_type_map
-- ----------------------------
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('1', '1', '1', '5');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('2', '1', '2', '4');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('3', '2', '12', '2');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('4', '3', '12', '1');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('5', '4', '5', '0');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('6', '1', '3', '3');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('7', '5', '9', '0');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('8', '1', '18', '0');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('10', '2', '20', '1');
INSERT INTO `topic_type_scheme_topic_type_map` VALUES ('11', '6', '18', '0');

-- ----------------------------
-- Table structure for `topic_type_screen_map`
-- ----------------------------
DROP TABLE IF EXISTS `topic_type_screen_map`;
CREATE TABLE `topic_type_screen_map` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `topic_type_id` int(10) unsigned NOT NULL,
  `screen_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `topic_type_id` (`topic_type_id`),
  KEY `screen_id` (`screen_id`),
  CONSTRAINT `topic_type_screen_map_ibfk_1` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  CONSTRAINT `topic_type_screen_map_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `view_screen` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_type_screen_map
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_user`
-- ----------------------------
DROP TABLE IF EXISTS `topic_user`;
CREATE TABLE `topic_user` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` bigint(14) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `access_level` enum('read','own') DEFAULT NULL,
  `active_yn` tinyint(1) unsigned DEFAULT NULL,
  `assigned_on` datetime DEFAULT NULL,
  `assigned_by_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_user
-- ----------------------------

-- ----------------------------
-- Table structure for `topic_user_invite`
-- ----------------------------
DROP TABLE IF EXISTS `topic_user_invite`;
CREATE TABLE `topic_user_invite` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` bigint(14) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `invited_by_user_id` int(11) NOT NULL,
  `invited_on` datetime DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `status_changed_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`topic_id`,`user_id`) USING BTREE,
  KEY `user_id` (`user_id`),
  CONSTRAINT `topic_user_invite_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`),
  CONSTRAINT `topic_user_invite_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of topic_user_invite
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('12', null, 'Admin', '$2a$10$.HISWzGAFPq8wHlffjOqbuxZ5VtkAAKTGavRjTOd20sJEW3PHhxcS', null, null, 'admin@brainfock.com', null, null, null, null, null);

-- ----------------------------
-- Table structure for `user_topic`
-- ----------------------------
DROP TABLE IF EXISTS `user_topic`;
CREATE TABLE `user_topic` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` bigint(14) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `access_level` enum('read','own') DEFAULT NULL,
  `active_yn` tinyint(1) unsigned DEFAULT NULL,
  `assigned_on` datetime DEFAULT NULL,
  `assigned_by_user_id` int(11) unsigned DEFAULT NULL,
  `starred_yn` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_topic
-- ----------------------------

-- ----------------------------
-- Table structure for `user_workspace`
-- ----------------------------
DROP TABLE IF EXISTS `user_workspace`;
CREATE TABLE `user_workspace` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `workspace_id` int(11) unsigned NOT NULL,
  `access_level` enum('read','own') DEFAULT NULL,
  `active_yn` tinyint(1) unsigned DEFAULT NULL,
  `assigned_on` datetime DEFAULT NULL,
  `assigned_by_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_workspace
-- ----------------------------

-- ----------------------------
-- Table structure for `view_screen`
-- ----------------------------
DROP TABLE IF EXISTS `view_screen`;
CREATE TABLE `view_screen` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `view` varchar(250) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL COMMENT 'Name in menu',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of view_screen
-- ----------------------------
INSERT INTO `view_screen` VALUES ('1', 'views/space/index', 'Workspace Index (projects)');
INSERT INTO `view_screen` VALUES ('3', null, 'Master-Detail view');

-- ----------------------------
-- Table structure for `wiki_link`
-- ----------------------------
DROP TABLE IF EXISTS `wiki_link`;
CREATE TABLE `wiki_link` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_from_id` int(11) NOT NULL,
  `page_to_id` int(11) DEFAULT NULL,
  `wiki_uid` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wiki_fk_link_page_from` (`page_from_id`) USING BTREE,
  KEY `wiki_fk_link_page_to` (`page_to_id`) USING BTREE,
  CONSTRAINT `wiki_link_ibfk_1` FOREIGN KEY (`page_from_id`) REFERENCES `wiki_page` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wiki_link_ibfk_2` FOREIGN KEY (`page_to_id`) REFERENCES `wiki_page` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1586 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wiki_link
-- ----------------------------

-- ----------------------------
-- Table structure for `wiki_page`
-- ----------------------------
DROP TABLE IF EXISTS `wiki_page`;
CREATE TABLE `wiki_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_id` bigint(14) unsigned DEFAULT NULL,
  `context_entity_id` bigint(14) unsigned NOT NULL DEFAULT '0',
  `is_redirect` tinyint(1) DEFAULT '0',
  `page_uid` varchar(255) DEFAULT NULL,
  `namespace` varchar(255) DEFAULT NULL,
  `content` text,
  `revision_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tree_root` int(11) unsigned DEFAULT NULL,
  `tree_lt` int(11) unsigned DEFAULT NULL,
  `tree_rt` int(11) unsigned DEFAULT NULL,
  `tree_level` mediumint(5) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `show_children_tree` tinyint(1) unsigned DEFAULT '0',
  `deleted_yn` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `wiki_idx_page_page_uid` (`page_uid`,`context_entity_id`,`namespace`) USING BTREE,
  KEY `wiki_idx_page_namespace` (`namespace`) USING BTREE,
  KEY `wiki_page_tree_root` (`tree_root`) USING BTREE,
  KEY `wiki_page_tree_lt` (`tree_lt`) USING BTREE,
  KEY `wiki_page_tree_rt` (`tree_rt`) USING BTREE,
  KEY `wiki_page_tree_level` (`tree_level`) USING BTREE,
  KEY `wiki_page_deleted_yn` (`deleted_yn`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wiki_page
-- ----------------------------

-- ----------------------------
-- Table structure for `wiki_page_revision`
-- ----------------------------
DROP TABLE IF EXISTS `wiki_page_revision`;
CREATE TABLE `wiki_page_revision` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `is_minor` tinyint(1) DEFAULT NULL,
  `content` text,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wiki_fk_page_revision_page` (`page_id`) USING BTREE,
  CONSTRAINT `wiki_page_revision_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `wiki_page` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wiki_page_revision
-- ----------------------------

-- ----------------------------
-- Table structure for `workflow`
-- ----------------------------
DROP TABLE IF EXISTS `workflow`;
CREATE TABLE `workflow` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `active_yn` tinyint(1) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workflow
-- ----------------------------
INSERT INTO `workflow` VALUES ('1', 'Simple Workflow', 'The most basic workflow, having three statuses', '1');
INSERT INTO `workflow` VALUES ('2', 'Discussion Topic Workflow', 'Simple workflow for forum topics: open & closed', null);
INSERT INTO `workflow` VALUES ('3', 'Advanced Discussions', 'Wf for a more advanced board, including pre-moderated topics, mergin etc.', null);

-- ----------------------------
-- Table structure for `workflow_instance`
-- ----------------------------
DROP TABLE IF EXISTS `workflow_instance`;
CREATE TABLE `workflow_instance` (
  `id` bigint(14) unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` bigint(14) unsigned DEFAULT NULL,
  `workflow_stage_id` int(11) unsigned DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workflow_instance
-- ----------------------------

-- ----------------------------
-- Table structure for `workflow_operation`
-- ----------------------------
DROP TABLE IF EXISTS `workflow_operation`;
CREATE TABLE `workflow_operation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `workflow_id` int(10) unsigned NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `outgoing_stage_id` int(10) unsigned NOT NULL,
  `biz_template` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `workflow_id` (`workflow_id`),
  KEY `outgoing_stage_id` (`outgoing_stage_id`),
  CONSTRAINT `workflow_operation_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`),
  CONSTRAINT `workflow_operation_ibfk_2` FOREIGN KEY (`outgoing_stage_id`) REFERENCES `workflow_stage` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workflow_operation
-- ----------------------------
INSERT INTO `workflow_operation` VALUES ('1', '1', 'Begin Progress', 'Put issue in progress', '2', null);
INSERT INTO `workflow_operation` VALUES ('2', '1', 'Close Issue', 'Mark issue as closed', '3', null);
INSERT INTO `workflow_operation` VALUES ('3', '1', 'Reopen Issue', null, '4', null);
INSERT INTO `workflow_operation` VALUES ('5', '1', 'Pause & Backlog', null, '1', null);

-- ----------------------------
-- Table structure for `workflow_scheme`
-- ----------------------------
DROP TABLE IF EXISTS `workflow_scheme`;
CREATE TABLE `workflow_scheme` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `summary` varchar(250) DEFAULT NULL,
  `default_workflow_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `default_workflow_id` (`default_workflow_id`),
  CONSTRAINT `workflow_scheme_ibfk_1` FOREIGN KEY (`default_workflow_id`) REFERENCES `workflow` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workflow_scheme
-- ----------------------------
INSERT INTO `workflow_scheme` VALUES ('1', 'Default Scheme', null, '1');

-- ----------------------------
-- Table structure for `workflow_scheme_topic_type_workflow_map`
-- ----------------------------
DROP TABLE IF EXISTS `workflow_scheme_topic_type_workflow_map`;
CREATE TABLE `workflow_scheme_topic_type_workflow_map` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `workflow_scheme_id` int(10) unsigned NOT NULL,
  `topic_type_id` int(10) unsigned NOT NULL,
  `workflow_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `workflow_scheme_id` (`workflow_scheme_id`),
  KEY `topic_type_id` (`topic_type_id`),
  KEY `workflow_id` (`workflow_id`),
  CONSTRAINT `workflow_scheme_topic_type_workflow_map_ibfk_1` FOREIGN KEY (`workflow_scheme_id`) REFERENCES `workflow_scheme` (`id`),
  CONSTRAINT `workflow_scheme_topic_type_workflow_map_ibfk_2` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  CONSTRAINT `workflow_scheme_topic_type_workflow_map_ibfk_3` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workflow_scheme_topic_type_workflow_map
-- ----------------------------
INSERT INTO `workflow_scheme_topic_type_workflow_map` VALUES ('1', '1', '1', '1');
INSERT INTO `workflow_scheme_topic_type_workflow_map` VALUES ('2', '1', '2', '1');
INSERT INTO `workflow_scheme_topic_type_workflow_map` VALUES ('3', '1', '3', '1');
INSERT INTO `workflow_scheme_topic_type_workflow_map` VALUES ('4', '1', '4', '1');
INSERT INTO `workflow_scheme_topic_type_workflow_map` VALUES ('5', '1', '5', '1');
INSERT INTO `workflow_scheme_topic_type_workflow_map` VALUES ('7', '1', '16', '1');
INSERT INTO `workflow_scheme_topic_type_workflow_map` VALUES ('8', '1', '17', '1');

-- ----------------------------
-- Table structure for `workflow_stage`
-- ----------------------------
DROP TABLE IF EXISTS `workflow_stage`;
CREATE TABLE `workflow_stage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `workflow_id` int(11) unsigned NOT NULL,
  `is_initial` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `biz_status` enum('open','progress','closed') NOT NULL COMMENT 'open - new issue, progress - issue is being worked on, closed - issue is closed',
  `status_term_value_id` int(10) unsigned DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status_term_value_id` (`status_term_value_id`),
  KEY `workflow_id` (`workflow_id`),
  KEY `workflow_id_2` (`workflow_id`,`is_initial`),
  CONSTRAINT `workflow_stage_ibfk_1` FOREIGN KEY (`status_term_value_id`) REFERENCES `term_value` (`id`),
  CONSTRAINT `workflow_stage_ibfk_2` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workflow_stage
-- ----------------------------
INSERT INTO `workflow_stage` VALUES ('1', '1', '1', 'open', '1', 'Issue in Backlog, initial stage');
INSERT INTO `workflow_stage` VALUES ('2', '1', '0', 'progress', '2', 'Issue is being worked on');
INSERT INTO `workflow_stage` VALUES ('3', '1', '0', 'closed', '3', 'Issue is resolved / closed');
INSERT INTO `workflow_stage` VALUES ('4', '1', '0', 'open', '4', 'Issue is waiting to be resolved');

-- ----------------------------
-- Table structure for `workflow_stage_operation_map`
-- ----------------------------
DROP TABLE IF EXISTS `workflow_stage_operation_map`;
CREATE TABLE `workflow_stage_operation_map` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `workflow_id` int(10) unsigned NOT NULL,
  `workflow_stage_id` int(10) unsigned NOT NULL,
  `workflow_operation_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `workflow_id` (`workflow_id`) USING BTREE,
  KEY `workflow_stage_id` (`workflow_stage_id`) USING BTREE,
  KEY `workflow_operation_id` (`workflow_operation_id`) USING BTREE,
  CONSTRAINT `workflow_stage_operation_map_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`),
  CONSTRAINT `workflow_stage_operation_map_ibfk_2` FOREIGN KEY (`workflow_stage_id`) REFERENCES `workflow_stage` (`id`),
  CONSTRAINT `workflow_stage_operation_map_ibfk_3` FOREIGN KEY (`workflow_operation_id`) REFERENCES `workflow_operation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workflow_stage_operation_map
-- ----------------------------
INSERT INTO `workflow_stage_operation_map` VALUES ('2', '1', '1', '1');
INSERT INTO `workflow_stage_operation_map` VALUES ('3', '1', '2', '2');
INSERT INTO `workflow_stage_operation_map` VALUES ('4', '1', '3', '3');
INSERT INTO `workflow_stage_operation_map` VALUES ('5', '1', '2', '5');
INSERT INTO `workflow_stage_operation_map` VALUES ('6', '1', '4', '1');
INSERT INTO `workflow_stage_operation_map` VALUES ('7', '1', '1', '2');

-- ----------------------------
-- Table structure for `workspace`
-- ----------------------------
DROP TABLE IF EXISTS `workspace`;
CREATE TABLE `workspace` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `namespace` varchar(100) NOT NULL DEFAULT 'namespace',
  `name` varchar(250) DEFAULT 'name',
  `owner_user_id` int(11) unsigned DEFAULT '1',
  `access_private_yn` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `private_yn` tinyint(1) DEFAULT '0' COMMENT 'Private is only available to owner user',
  `topic_group_scheme_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`,`namespace`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of workspace
-- ----------------------------

-- ----------------------------
-- View structure for `v_comment`
-- ----------------------------
DROP VIEW IF EXISTS `v_comment`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_comment` AS select `entity`.`owner_user_id` AS `owner_user_id`,`entity`.`access_private_yn` AS `access_private_yn`,`comment`.`id` AS `id`,`comment`.`parent_id` AS `parent_id`,`comment`.`thread_id` AS `thread_id`,`comment`.`entity_id` AS `entity_id`,`comment`.`author_id` AS `author_id`,`comment`.`authorIp` AS `authorIp`,`comment`.`author_ip_long` AS `author_ip_long`,`comment`.`text` AS `text`,`comment`.`text_hash` AS `text_hash`,`comment`.`created_on` AS `created_on`,`comment`.`deleted` AS `deleted`,`comment`.`status` AS `status`,`comment`.`rating` AS `rating`,`comment`.`count_positive_votes` AS `count_positive_votes`,`comment`.`count_negative_votes` AS `count_negative_votes`,`comment`.`notify_me` AS `notify_me`,`comment`.`level` AS `level` from (`comment` join `entity` on((`entity`.`id` = `comment`.`entity_id`))) ;

-- ----------------------------
-- View structure for `v_topic`
-- ----------------------------
DROP VIEW IF EXISTS `v_topic`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_topic` AS select `topic`.`id` AS `id`,`topic_group`.`group_key` AS `group_key`,`topic`.`milestone_topic_id` AS `milestone_topic_id`,`topic`.`entity_id` AS `entity_id`,`topic`.`group_id` AS `group_id`,`topic`.`type_id` AS `type_id`,`topic`.`workflow_stage_id` AS `workflow_stage_id`,`topic`.`status` AS `status`,`topic`.`closed_yn` AS `closed_yn`,`topic`.`closed_on` AS `closed_on`,`topic`.`deleted_yn` AS `deleted_yn`,`topic`.`deleted_on` AS `deleted_on`,`topic`.`parent_topic_id` AS `parent_topic_id`,`topic`.`sort_order` AS `sort_order`,`topic`.`context_topic_id` AS `context_topic_id`,`topic`.`context_topic_num` AS `context_topic_num`,`topic`.`context_topic_key` AS `context_topic_key`,`topic`.`summary` AS `summary`,`topic`.`count_comments` AS `count_comments`,`topic`.`owner_user_id` AS `owner_user_id`,`topic`.`access_private_yn` AS `access_private_yn`,`topic`.`assigned_user_id` AS `assigned_user_id`,`topic`.`text` AS `text`,`topic`.`submitted_on` AS `submitted_on`,`topic`.`created_on` AS `created_on`,`topic`.`updated_on` AS `updated_on`,`topic`.`due_date` AS `due_date`,`topic`.`logo_icon` AS `logo_icon`,`topic`.`logo_background` AS `logo_background`,`topic`.`completed_percentage` AS `completed_percentage`,`topic`.`workspace_id` AS `workspace_id`,`topic`.`owner_namespace` AS `owner_namespace`,`term_value`.`value` AS `wf_stage`,`workflow_stage`.`biz_status` AS `wf_status`,`topic`.`submitted_user_id` AS `submitted_user_id`,`topic`.`group_scheme_id` AS `group_scheme_id`,`topic`.`priority_id` AS `priority_id` from (((`topic` join `topic_group` on((`topic`.`group_id` = `topic_group`.`id`))) join `workflow_stage` on((`topic`.`workflow_stage_id` = `workflow_stage`.`id`))) join `term_value` on((`workflow_stage`.`status_term_value_id` = `term_value`.`id`))) ;

-- ----------------------------
-- View structure for `v_user_topic`
-- ----------------------------
DROP VIEW IF EXISTS `v_user_topic`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_topic` AS select `usr`.`id` AS `user_id`,`topic`.`id` AS `topic_id` from (`user` `usr` join (`topic` left join `topic_user` `u` on((`u`.`topic_id` = `topic`.`id`)))) where ((`u`.`user_id` is not null) or (`topic`.`access_private_yn` = 0)) group by `usr`.`id`,`topic`.`id` ;

-- ----------------------------
-- View structure for `wiki_page_view`
-- ----------------------------
DROP VIEW IF EXISTS `wiki_page_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wiki_page_view` AS select `entity`.`owner_user_id` AS `owner_user_id`,`entity`.`access_private_yn` AS `access_private_yn`,`wiki_page`.`id` AS `id`,`wiki_page`.`entity_id` AS `entity_id`,`wiki_page`.`context_entity_id` AS `context_entity_id`,`wiki_page`.`is_redirect` AS `is_redirect`,`wiki_page`.`page_uid` AS `page_uid`,`wiki_page`.`namespace` AS `namespace`,`wiki_page`.`content` AS `content`,`wiki_page`.`revision_id` AS `revision_id`,`wiki_page`.`user_id` AS `user_id`,`wiki_page`.`name` AS `name`,`wiki_page`.`deleted_yn` AS `deleted_yn`,`wiki_page`.`updated_on` AS `updated_on` from (`wiki_page` join `entity` on((`entity`.`id` = `wiki_page`.`entity_id`))) ;
DROP TRIGGER IF EXISTS `sequence`;
DELIMITER ;;
CREATE TRIGGER `sequence` BEFORE INSERT ON `topic` FOR EACH ROW BEGIN

DECLARE has_sequence integer;
DECLARE next_sequence_num integer;
DECLARE parent_group_scheme_id integer;
DECLARE parent_sequence_group_id integer;
DECLARE parent_key_prefix varchar(100);

  
  IF new.group_id > 0 AND new.context_topic_id > 0 THEN
    INSERT INTO `sequence` (owner_topic_id,topic_group_id,counter) VALUES (new.context_topic_id,new.group_id,0)
        ON DUPLICATE KEY UPDATE counter=counter+1;
  
    SELECT MAX(t.counter) 
      INTO @next_sequence_num
      FROM sequence t
      WHERE t.owner_topic_id = new.context_topic_id 
      AND t.topic_group_id=new.group_id;

    IF @next_sequence_num IS NOT NULL AND @next_sequence_num  > 0 THEN
      SET new.context_topic_num = @next_sequence_num+1;
    ELSE
      SET new.context_topic_num = 1;
    END IF;

    /* set topic key */
    IF new.context_topic_id  > 0 THEN
      /* get context topic info */
      SELECT context_topic_key, group_scheme_id  INTO @parent_key_prefix , @parent_group_scheme_id
        FROM topic 
        WHERE topic.id = new.context_topic_id;
      
      SELECT root_group_id INTO @parent_sequence_group_id
        FROM topic_group_scheme 
        WHERE topic_group_scheme.id = @parent_group_scheme_id;
        
      IF @parent_sequence_group_id = new.group_id THEN
        SET new.context_topic_key = CONCAT_WS('-',@parent_key_prefix, new.context_topic_num);
      END IF; 
    END IF; 

  END IF; /*  IF @group_id .. */	
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `sync_entity`;
DELIMITER ;;
CREATE TRIGGER `sync_entity` AFTER UPDATE ON `topic` FOR EACH ROW BEGIN

    IF new.entity_id > 0 AND (new.access_private_yn != old.access_private_yn OR new.owner_user_id != old.owner_user_id) THEN
      UPDATE `entity` set access_private_yn = new.access_private_yn, owner_user_id=new.owner_user_id
        where id = new.entity_id;
    END IF;
END
;;
DELIMITER ;
