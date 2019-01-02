-- phpMyAdmin SQL Dump
-- version 4.6.6deb1+deb.cihar.com~trusty.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 02, 2019 at 12:03 PM
-- Server version: 5.5.59-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `brainfock_node`
--

-- --------------------------------------------------------

--
-- Table structure for table `AccessToken`
--

CREATE TABLE `AccessToken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `AccessToken`
--

INSERT INTO `AccessToken` (`id`, `ttl`, `created`, `userId`) VALUES
('37mGJYA3DwMwQ5UReT41rKEKk7sdDNkZQDvHG24HejqjFsFGdq6kaqrn2cn53FDj', 1209600, '2018-12-13 10:49:31', 3),
('3dAHP6w83EpKW1pi1ayNxAeOSvY9sfpoH4zonW20oJkHXpXzTE6eyBGAAL3BhoVG', 1209600, '2018-12-13 11:21:34', 3),
('3wERZEs23nsnB5XjHfU2OhXUHI0H1kCzOVKTVDWiPlXp1Ie3cyBphh3JVIaQoBWO', 1209600, '2018-12-13 11:22:03', 3),
('Hcn1A3ZpzLIHOkUps4emOc2McSCpPlhQY7wcBjEfnC2bULKBaEmYlCe35bF7MD7k', 1209600, '2018-12-13 10:58:21', 3),
('O8AUaSTRp6m7GfGK2YfZg26MVXyNB9fUrFj6WKREn0zjGxd8CzECl1YsERulmjOP', 1209600, '2018-12-13 11:11:12', 3);

-- --------------------------------------------------------

--
-- Table structure for table `accesstoken`
--

CREATE TABLE `accesstoken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ACL`
--

CREATE TABLE `ACL` (
  `id` int(11) NOT NULL,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `acl`
--

CREATE TABLE `acl` (
  `id` int(11) NOT NULL,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `acl`
--

INSERT INTO `acl` (`id`, `model`, `property`, `accessType`, `permission`, `principalType`, `principalId`) VALUES
(2, 'RawTopic', 'deleteById', '*', 'ALLOW', 'ROLE', '$owner'),
(8, 'Topic', '*', '*', 'ALLOW', 'ROLE', 'Admin'),
(9, 'RawTopic', 'deleteById', '*', 'ALLOW', 'ROLE', 'Admin'),
(10, 'SettingsField', '*', '*', 'ALLOW', 'ROLE', 'Admin'),
(11, 'TopicGroupScheme', '*', '*', 'ALLOW', 'ROLE', 'Admin'),
(12, 'Term', '*', '*', 'ALLOW', 'ROLE', 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `activitystream_template`
--

CREATE TABLE `activitystream_template` (
  `id` varchar(100) NOT NULL,
  `summary` varchar(250) DEFAULT NULL COMMENT 'Description for admin/developer',
  `template` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `activitystream_template`
--

INSERT INTO `activitystream_template` (`id`, `summary`, `template`) VALUES
('topic_created', NULL, 'Created ${TYPE_NAME}');

-- --------------------------------------------------------

--
-- Table structure for table `activitystream_topictype_action_template`
--

CREATE TABLE `activitystream_topictype_action_template` (
  `topic_type_id` int(10) UNSIGNED NOT NULL,
  `action` char(50) DEFAULT NULL,
  `activity_template_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `activitystream_topictype_action_template`
--

INSERT INTO `activitystream_topictype_action_template` (`topic_type_id`, `action`, `activity_template_id`) VALUES
(9, 'CREATE', 'topic_created');

-- --------------------------------------------------------

--
-- Table structure for table `activity_stream_entity_feed`
--

CREATE TABLE `activity_stream_entity_feed` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `stream_event_id` bigint(14) UNSIGNED NOT NULL,
  `entity_id` bigint(14) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `activity_stream_event`
--

CREATE TABLE `activity_stream_event` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `event_type` smallint(2) UNSIGNED NOT NULL,
  `subject_entity_id` bigint(14) DEFAULT NULL,
  `object_entity_id` bigint(14) DEFAULT NULL,
  `extra_data` blob,
  `datetime` datetime DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `activity_stream_project_feed`
--

CREATE TABLE `activity_stream_project_feed` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `stream_event_id` bigint(14) UNSIGNED NOT NULL,
  `project_id` int(11) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `app_routes`
--

CREATE TABLE `app_routes` (
  `id` mediumint(5) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` varchar(250) NOT NULL,
  `handler` varchar(250) NOT NULL,
  `parent_id` mediumint(5) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(12) UNSIGNED NOT NULL,
  `parent_id` int(12) UNSIGNED DEFAULT NULL,
  `thread_id` int(12) UNSIGNED DEFAULT NULL,
  `entity_id` int(12) UNSIGNED DEFAULT NULL,
  `author_id` int(10) UNSIGNED DEFAULT NULL,
  `authorIp` varchar(250) DEFAULT NULL,
  `author_ip_long` int(10) NOT NULL,
  `text` text,
  `text_hash` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `created_on` datetime NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('pending','deleted','approved') DEFAULT NULL,
  `rating` float NOT NULL DEFAULT '0',
  `count_positive_votes` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `count_negative_votes` int(10) UNSIGNED DEFAULT NULL,
  `notify_me` tinyint(1) DEFAULT NULL,
  `level` smallint(5) UNSIGNED DEFAULT '0' COMMENT 'Comment indent level, starting from 0 as root-level'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='<double-click to overwrite multiple objects>';

-- --------------------------------------------------------

--
-- Table structure for table `comment_revision`
--

CREATE TABLE `comment_revision` (
  `id` bigint(12) UNSIGNED NOT NULL,
  `log_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `comment_id` int(12) UNSIGNED DEFAULT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `revision` smallint(3) UNSIGNED DEFAULT '1',
  `model_data` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard`
--

CREATE TABLE `dashboard` (
  `id` int(10) UNSIGNED NOT NULL,
  `owner_entity_id` bigint(14) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_widget`
--

CREATE TABLE `dashboard_widget` (
  `id` int(10) UNSIGNED NOT NULL,
  `widget_id` varchar(255) DEFAULT NULL,
  `dashboard_id` int(10) UNSIGNED DEFAULT NULL,
  `block_id` int(10) UNSIGNED DEFAULT NULL,
  `sort_ord` smallint(5) UNSIGNED DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `params` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `entity`
--

CREATE TABLE `entity` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `owner_user_id` int(11) UNSIGNED DEFAULT NULL,
  `access_private_yn` tinyint(3) UNSIGNED DEFAULT '0',
  `model_pk` bigint(14) UNSIGNED DEFAULT NULL,
  `model_class_name` varchar(50) NOT NULL,
  `model_front_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `entity_access_assign`
--

CREATE TABLE `entity_access_assign` (
  `auth_id` int(11) NOT NULL,
  `auth_type` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `entity_id` bigint(14) UNSIGNED NOT NULL,
  `level` tinyint(3) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `entity_available_feature`
--

CREATE TABLE `entity_available_feature` (
  `id` int(11) UNSIGNED NOT NULL,
  `entity_menu_id` int(11) UNSIGNED NOT NULL,
  `link` varchar(250) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `topic_group_id` int(11) DEFAULT NULL,
  `topic_type_id` int(11) DEFAULT NULL,
  `topic_user_filter_id` int(11) DEFAULT NULL,
  `label` varchar(250) DEFAULT NULL,
  `label_language` char(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `entity_feature`
--

CREATE TABLE `entity_feature` (
  `id` int(11) UNSIGNED NOT NULL,
  `entity_id` bigint(14) UNSIGNED NOT NULL,
  `summary` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `entity_menu`
--

CREATE TABLE `entity_menu` (
  `id` int(11) UNSIGNED NOT NULL,
  `entity_id` bigint(14) UNSIGNED NOT NULL,
  `summary` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `entity_menu_item`
--

CREATE TABLE `entity_menu_item` (
  `id` int(11) UNSIGNED NOT NULL,
  `entity_menu_id` int(11) UNSIGNED NOT NULL,
  `link` varchar(250) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `topic_group_id` int(11) DEFAULT NULL,
  `topic_type_id` int(11) DEFAULT NULL,
  `topic_user_filter_id` int(11) DEFAULT NULL,
  `label` varchar(250) DEFAULT NULL,
  `label_language` char(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `entity_workflow_operation`
--

CREATE TABLE `entity_workflow_operation` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `entity_id` bigint(14) UNSIGNED NOT NULL,
  `workflow_operation_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `in_stage_id` int(11) UNSIGNED NOT NULL,
  `out_stage_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `field`
--

CREATE TABLE `field` (
  `id` int(10) UNSIGNED NOT NULL,
  `key` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `filter_type` enum('date','daterange','select','multiselect','text') DEFAULT 'text'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `field`
--

INSERT INTO `field` (`id`, `key`, `name`, `filter_type`) VALUES
(1, 'fixVersion', 'Fixes Version(s)', 'multiselect'),
(2, 'affectsVersion', 'Affects Version', 'multiselect'),
(3, 'component', 'Component(s)', 'multiselect'),
(4, 'assignee', 'Assignee', 'select'),
(5, 'reporter', 'Reporter', 'select'),
(6, 'businessValue', 'Business Value', NULL),
(7, 'comment', 'Comment', NULL),
(8, 'dueDate', 'Due Date', 'date'),
(9, 'environment', 'Environment', 'text'),
(10, 'epic_link', 'Epic Link', 'multiselect'),
(11, 'typeId_', 'Issue Type', 'multiselect'),
(12, 'labels', 'Labels', 'multiselect'),
(13, 'linked_issues', 'Linked Issues', 'multiselect'),
(14, 'priorityId', 'Priority', 'select'),
(15, 'version_history', 'Version History', NULL),
(16, 'resolution', 'Resolution', 'text'),
(17, 'sprint', 'Sprint', 'multiselect'),
(18, 'summary', 'Summary', 'text'),
(19, 'logo_icon', 'Icon CSS selector name (Font Awesome)', 'text'),
(20, 'logo_background', 'Icon background color code from colors.js', 'text'),
(21, 'contextTopicId', NULL, 'select'),
(22, 'text', 'Details', 'text'),
(23, 'contextTopicKey', 'Key (code)', 'text'),
(25, 'groupSchemeId', 'Group Scheme', 'select'),
(26, 'parentTopicId', '%ParentGroupName%', 'select'),
(27, 'contextTopicParentId', NULL, 'text');

-- --------------------------------------------------------

--
-- Table structure for table `filter_field`
--

CREATE TABLE `filter_field` (
  `id` int(11) UNSIGNED NOT NULL,
  `filed_key` int(11) UNSIGNED NOT NULL,
  `sort_weight` smallint(5) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `filter_preset`
--

CREATE TABLE `filter_preset` (
  `id` int(11) UNSIGNED NOT NULL,
  `preset_key` varchar(100) NOT NULL,
  `summary` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `filter_preset`
--

INSERT INTO `filter_preset` (`id`, `preset_key`, `summary`) VALUES
(1, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Role`
--

CREATE TABLE `Role` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `description`, `created`, `modified`) VALUES
(2, 'Admin', NULL, '2015-10-25 21:10:49', '2015-10-25 21:10:49'),
(4, 'allowUpdateTopics', NULL, NULL, NULL),
(6, 'Test', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `RoleMapping`
--

CREATE TABLE `RoleMapping` (
  `id` int(11) NOT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` int(11) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rolemapping`
--

CREATE TABLE `rolemapping` (
  `id` int(11) NOT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rolemapping`
--

INSERT INTO `rolemapping` (`id`, `principalType`, `principalId`, `roleId`) VALUES
(2, 'USER', '12', 2),
(6, 'USER', '12', 6);

-- --------------------------------------------------------

--
-- Table structure for table `screen`
--

CREATE TABLE `screen` (
  `id` int(10) UNSIGNED NOT NULL,
  `key` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `screen`
--

INSERT INTO `screen` (`id`, `key`, `name`) VALUES
(1, NULL, 'Default Issue Create Form'),
(2, NULL, 'Default Board Topic Form'),
(3, NULL, 'Create context board form'),
(4, NULL, 'Default Project Form'),
(5, NULL, 'Create root board'),
(6, NULL, 'Create Opportunity Form');

-- --------------------------------------------------------

--
-- Table structure for table `screen_field`
--

CREATE TABLE `screen_field` (
  `id` int(10) UNSIGNED NOT NULL,
  `screen_id` int(10) UNSIGNED NOT NULL,
  `field_id` int(10) UNSIGNED NOT NULL,
  `sort_weight` smallint(5) UNSIGNED DEFAULT NULL COMMENT 'heavier on top',
  `is_required` tinyint(1) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `screen_field`
--

INSERT INTO `screen_field` (`id`, `screen_id`, `field_id`, `sort_weight`, `is_required`) VALUES
(1, 1, 18, 90, 0),
(2, 1, 4, NULL, 0),
(3, 1, 8, NULL, 0),
(4, 3, 9, 1, 0),
(5, 1, 12, NULL, 0),
(6, 1, 13, NULL, 0),
(7, 1, 14, 50, 0),
(8, 1, 16, NULL, 0),
(9, 1, 21, 300, 0),
(10, 1, 11, 100, 0),
(11, 1, 22, 80, 0),
(12, 2, 18, 100, 0),
(15, 3, 21, NULL, 0),
(16, 4, 18, 90, 0),
(17, 4, 23, NULL, 0),
(21, 2, 22, NULL, 0),
(22, 4, 25, 500, 0),
(23, 3, 18, NULL, 0),
(24, 2, 26, 500, 0),
(25, 3, 27, 100, 0),
(26, 5, 27, 100, 0),
(27, 5, 18, 200, 0),
(29, 5, 23, NULL, 0),
(30, 6, 18, 100, 0);

-- --------------------------------------------------------

--
-- Table structure for table `screen_scheme`
--

CREATE TABLE `screen_scheme` (
  `id` int(11) UNSIGNED NOT NULL,
  `group_id` int(10) UNSIGNED DEFAULT NULL,
  `default_screen_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `screen_scheme`
--

INSERT INTO `screen_scheme` (`id`, `group_id`, `default_screen_id`, `name`, `summary`) VALUES
(1, 1, NULL, 'Default Scheme For Issues', 'Describes which screens will show for certain topic_type'),
(2, 3, NULL, 'board', NULL),
(3, 19, NULL, 'contextBoard', NULL),
(4, 9, 4, 'New Project', 'Create project form'),
(5, 4, NULL, 'Board Topic', NULL),
(6, 10, 6, 'Opportunity', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `screen_scheme_topic_type_screen_map`
--

CREATE TABLE `screen_scheme_topic_type_screen_map` (
  `id` int(11) UNSIGNED NOT NULL,
  `screen_scheme_id` int(11) UNSIGNED DEFAULT NULL,
  `topic_type_id` int(10) UNSIGNED DEFAULT NULL,
  `screen_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `screen_scheme_topic_type_screen_map`
--

INSERT INTO `screen_scheme_topic_type_screen_map` (`id`, `screen_scheme_id`, `topic_type_id`, `screen_id`) VALUES
(1, 1, 1, 1),
(2, 2, 12, 5),
(3, 3, 12, 3),
(4, 4, 5, 4),
(5, 5, 9, 2),
(6, 4, 18, 4);

-- --------------------------------------------------------

--
-- Table structure for table `sequence`
--

CREATE TABLE `sequence` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `owner_topic_id` bigint(14) UNSIGNED NOT NULL COMMENT 'Entity that owns the sequence',
  `topic_group_id` int(10) UNSIGNED NOT NULL,
  `counter` smallint(5) UNSIGNED NOT NULL DEFAULT '0',
  `is_ordered` tinyint(1) NOT NULL DEFAULT '1',
  `format` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `category` varchar(64) NOT NULL DEFAULT 'system',
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `serialize_policy` enum('php','json') DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `settings_field`
--

CREATE TABLE `settings_field` (
  `category_key` varchar(250) NOT NULL,
  `id` varchar(100) NOT NULL,
  `label` varchar(250) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `sort_weight` smallint(5) UNSIGNED DEFAULT NULL,
  `type` enum('date','text','textarea','select','multiselect','checkbox','radio') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `settings_field`
--

INSERT INTO `settings_field` (`category_key`, `id`, `label`, `description`, `sort_weight`, `type`) VALUES
('wkd.auth', 'disabledRegistrationMessage', 'Message when registration is disabled', NULL, 19, 'textarea'),
('wkd.auth', 'enableExtendedLoginProvider', 'Allow to sign in/up via Auth providers like Google, Facebook etc.', NULL, NULL, 'checkbox'),
('wkd.auth', 'enableRegistration', 'Allow guests to create accounts', NULL, 20, 'checkbox'),
('bfk.general', 'guestAccessAllowed', 'Allow Guest Access', 'Users always prompted to login if this is turned off', 10, 'checkbox'),
('wkd.auth', 'minPasswordLength', 'Minimal password length', NULL, NULL, 'text'),
('wkd.auth', 'signInCaptcha', 'Login captcha', NULL, NULL, 'checkbox'),
('wkd.auth', 'signUpCaptcha', 'Sign up captcha', NULL, NULL, 'checkbox'),
('wkd.auth', 'signUpRequireDisplayName', 'Require to create \"Display Name\" on sign up', NULL, NULL, 'checkbox'),
('wkd.auth', 'signUpUsernameIsNotEmail', 'Require to create username on sign up', NULL, NULL, 'checkbox');

-- --------------------------------------------------------

--
-- Table structure for table `term`
--

CREATE TABLE `term` (
  `id` int(10) UNSIGNED NOT NULL,
  `key` varchar(32) DEFAULT NULL,
  `workspace_id` int(11) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `label_config` blob COMMENT 'JSON',
  `has_custom_value_configs` tinyint(1) UNSIGNED DEFAULT '0',
  `hotkey_path` char(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `term`
--

INSERT INTO `term` (`id`, `key`, `workspace_id`, `name`, `label_config`, `has_custom_value_configs`, `hotkey_path`) VALUES
(1, 'status', NULL, 'Status', NULL, 0, '>'),
(5, 'priority', NULL, 'Priority', NULL, 0, '!'),
(6, 'label', NULL, 'Label', NULL, 0, '#');

-- --------------------------------------------------------

--
-- Table structure for table `term_value`
--

CREATE TABLE `term_value` (
  `id` int(10) UNSIGNED NOT NULL,
  `term_id` int(10) UNSIGNED NOT NULL,
  `value` varchar(255) NOT NULL,
  `label_config` mediumblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `term_value`
--

INSERT INTO `term_value` (`id`, `term_id`, `value`, `label_config`) VALUES
(1, 1, 'Backlog', NULL),
(2, 1, 'In Progress', NULL),
(3, 1, 'Closed', NULL),
(4, 1, 'Open', NULL),
(5, 5, 'Blocker', 0x7b22636c72223a22726564363030227d),
(7, 5, 'Important', 0x7b22636c72223a22726564363030227d),
(8, 5, 'Low', NULL),
(9, 5, 'Regular', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE `topic` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `entity_id` bigint(14) UNSIGNED DEFAULT NULL,
  `owner_namespace` varchar(255) DEFAULT NULL,
  `workspace_id` int(11) UNSIGNED NOT NULL,
  `context_topic_id` bigint(14) UNSIGNED DEFAULT NULL COMMENT 'Context of this issue, e.g. project id',
  `parent_topic_id` bigint(14) UNSIGNED DEFAULT '0' COMMENT 'link to topic category/section, or parent issue',
  `group_id` int(10) UNSIGNED DEFAULT NULL,
  `context_topic_key` varchar(100) DEFAULT NULL,
  `context_topic_num` smallint(5) UNSIGNED DEFAULT NULL,
  `type_id` int(10) UNSIGNED DEFAULT NULL,
  `group_scheme_id` int(10) UNSIGNED DEFAULT NULL,
  `milestone_topic_id` int(11) DEFAULT NULL,
  `workflow_stage_id` int(11) UNSIGNED DEFAULT NULL,
  `status` enum('closed','open','progress') DEFAULT 'open' COMMENT 'open - new issue, progress - issue is being worked on, closed - issue is closed',
  `closed_yn` tinyint(1) UNSIGNED DEFAULT '0',
  `closed_on` datetime DEFAULT NULL,
  `deleted_yn` tinyint(1) UNSIGNED DEFAULT '0',
  `deleted_on` datetime DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `count_comments` smallint(5) UNSIGNED NOT NULL DEFAULT '0',
  `owner_user_id` int(10) UNSIGNED DEFAULT NULL,
  `access_private_yn` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `assigned_user_id` int(10) UNSIGNED DEFAULT NULL,
  `submitted_user_id` int(10) DEFAULT NULL,
  `priority_id` int(10) UNSIGNED DEFAULT '0' COMMENT '0-4 priority, 4 is the highest',
  `text` text,
  `submitted_on` datetime DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_date` datetime DEFAULT NULL,
  `logo_icon` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `logo_background` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `completed_percentage` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `topic`
--
DELIMITER $$
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

    
    IF new.context_topic_id  > 0 THEN
      
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

  END IF; 	
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sync_entity` AFTER UPDATE ON `topic` FOR EACH ROW BEGIN

    IF new.entity_id > 0 AND (new.access_private_yn != old.access_private_yn OR new.owner_user_id != old.owner_user_id) THEN
      UPDATE `entity` set access_private_yn = new.access_private_yn, owner_user_id=new.owner_user_id
        where id = new.entity_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `topic_category`
--

CREATE TABLE `topic_category` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `group_id` int(10) UNSIGNED NOT NULL,
  `order_in_group` mediumint(6) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Topic category is like a folder for topic, based on group';

-- --------------------------------------------------------

--
-- Table structure for table `topic_context`
--

CREATE TABLE `topic_context` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `owner_namespace` varchar(255) DEFAULT NULL,
  `workspace_id` int(11) UNSIGNED NOT NULL,
  `milestone_topic_id` int(11) DEFAULT NULL,
  `entity_id` bigint(14) UNSIGNED DEFAULT NULL,
  `group_scheme_id` int(10) UNSIGNED DEFAULT NULL,
  `group_id` int(10) UNSIGNED DEFAULT NULL,
  `type_id` int(10) UNSIGNED DEFAULT NULL,
  `workflow_stage_id` int(11) UNSIGNED DEFAULT NULL,
  `status` enum('closed','open','progress') DEFAULT 'open' COMMENT 'open - new issue, progress - issue is being worked on, closed - issue is closed',
  `closed_yn` tinyint(1) UNSIGNED DEFAULT '0',
  `closed_on` datetime DEFAULT NULL,
  `deleted_yn` tinyint(1) UNSIGNED DEFAULT '0',
  `deleted_on` datetime DEFAULT NULL,
  `parent_topic_id` bigint(14) UNSIGNED DEFAULT '0' COMMENT 'link to topic category/section, or parent issue',
  `sort_order` smallint(5) UNSIGNED DEFAULT NULL,
  `context_topic_num` smallint(5) UNSIGNED DEFAULT NULL,
  `context_topic_key` varchar(100) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `count_comments` smallint(5) UNSIGNED NOT NULL DEFAULT '0',
  `owner_user_id` int(10) UNSIGNED DEFAULT NULL,
  `access_private_yn` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `assigned_user_id` int(10) UNSIGNED DEFAULT NULL,
  `submitted_user_id` int(10) DEFAULT NULL,
  `priority` tinyint(1) UNSIGNED DEFAULT '0' COMMENT '0-4 priority, 4 is the highest',
  `text` text,
  `submitted_on` datetime DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_date` datetime DEFAULT NULL,
  `_stream_id` int(10) UNSIGNED DEFAULT NULL,
  `logo_icon` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `logo_background` varchar(50) DEFAULT NULL COMMENT 'TODO: move to topic_field_value or EAV',
  `completed_percentage` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_field_value`
--

CREATE TABLE `topic_field_value` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `field_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_group`
--

CREATE TABLE `topic_group` (
  `id` int(10) UNSIGNED NOT NULL,
  `parent_group_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `group_key` varchar(255) DEFAULT NULL,
  `has_sequence_yn` tinyint(1) UNSIGNED DEFAULT NULL,
  `sequence_id` bigint(20) UNSIGNED DEFAULT NULL,
  `context_yn` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'topics in such groups provide link to topic_type_scheme',
  `router_path` varchar(100) DEFAULT NULL,
  `permalink` varchar(100) DEFAULT NULL,
  `view` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `topic_group`
--

INSERT INTO `topic_group` (`id`, `parent_group_id`, `name`, `summary`, `group_key`, `has_sequence_yn`, `sequence_id`, `context_yn`, `router_path`, `permalink`, `view`) VALUES
(1, 9, 'Issue', 'Issues, Tasks etc', 'issue', 1, NULL, 0, 'issues', '/:namespace/:board_key/:topic_key', 'master.detail'),
(3, NULL, 'Boards', 'Discussion Board ', 'board', 0, NULL, 1, '/boards', '/board/:id/:topic_key', 'list'),
(4, 3, 'Board Topic', 'Discussion Board topic', 'board_topic', 0, NULL, 0, NULL, '/board/:context_id/:board_key/:id/:topic_key', 'list'),
(7, NULL, 'Project Release', NULL, NULL, 0, NULL, 0, NULL, NULL, 'master.detail'),
(8, NULL, 'Milestones', 'Versions, Milestones', 'plan', 0, NULL, 0, NULL, '/project/:board_key/milestones/:id', 'master.detail'),
(9, NULL, 'Projects', 'Projects', 'project', 0, NULL, 1, '/projects', '/:namespace/:topic_key', 'master.detail'),
(10, NULL, 'Opportunities', 'Deals with clients, leads', 'opportunity', 0, NULL, 0, NULL, NULL, 'master.detail'),
(11, NULL, 'Message', NULL, 'message', 0, NULL, 0, NULL, NULL, 'master.detail'),
(12, NULL, 'Event', 'Calendar Events & Meetings (reserved)', 'event', 0, NULL, 0, NULL, NULL, 'calendar'),
(13, 9, 'Version', 'Application version', 'version', 0, NULL, 0, NULL, NULL, 'master.detail'),
(14, 9, 'Component', 'Component', 'component', 0, NULL, 0, NULL, NULL, 'master.detail'),
(19, 9, 'Discussion Board', NULL, 'contextBoard', 0, NULL, 0, NULL, '/board/:id/:board_key', 'master.detail'),
(20, NULL, 'Lecture', NULL, 'lectures', NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topic_group_scheme`
--

CREATE TABLE `topic_group_scheme` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `root_group_id` int(10) UNSIGNED NOT NULL COMMENT 'Main group in this scheme. only topics in that group will have be given prefix in `contextTopicKey` value'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='This is a set of issue types that project has';

--
-- Dumping data for table `topic_group_scheme`
--

INSERT INTO `topic_group_scheme` (`id`, `name`, `is_default`, `root_group_id`) VALUES
(1, 'Software Development', 1, 1),
(2, 'Sales Management', 1, 10),
(4, 'Educational Initiative', 0, 1),
(6, 'Community Boards', 0, 1),
(7, 'Projects', 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `topic_group_scheme_group_map`
--

CREATE TABLE `topic_group_scheme_group_map` (
  `id` int(11) UNSIGNED NOT NULL,
  `topic_group_scheme_id` int(11) UNSIGNED NOT NULL,
  `topic_group_id` int(11) UNSIGNED NOT NULL,
  `available_sub_group_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `topic_group_scheme_group_map`
--

INSERT INTO `topic_group_scheme_group_map` (`id`, `topic_group_scheme_id`, `topic_group_id`, `available_sub_group_id`) VALUES
(1, 1, 1, 1),
(2, 1, 19, 3),
(3, 1, 9, 4),
(4, 1, 3, 2),
(5, 1, 4, 5),
(6, 1, 9, 1),
(7, 2, 10, 0),
(8, 6, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `topic_group_scheme_type_scheme_map`
--

CREATE TABLE `topic_group_scheme_type_scheme_map` (
  `id` int(11) UNSIGNED NOT NULL,
  `topic_group_scheme_id` int(11) UNSIGNED NOT NULL,
  `topic_group_id` int(11) UNSIGNED NOT NULL,
  `topic_type_scheme_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `topic_group_scheme_type_scheme_map`
--

INSERT INTO `topic_group_scheme_type_scheme_map` (`id`, `topic_group_scheme_id`, `topic_group_id`, `topic_type_scheme_id`) VALUES
(1, 1, 1, 1),
(2, 1, 19, 3),
(3, 7, 9, 4),
(4, 1, 3, 2),
(5, 1, 4, 5),
(7, 2, 10, 6),
(8, 6, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `topic_instance_group_scheme`
--

CREATE TABLE `topic_instance_group_scheme` (
  `id` int(11) UNSIGNED NOT NULL,
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `topic_group_id` int(11) UNSIGNED NOT NULL,
  `topic_type_scheme_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_instance_menu`
--

CREATE TABLE `topic_instance_menu` (
  `id` int(11) UNSIGNED NOT NULL,
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `topic_group_id` int(11) UNSIGNED NOT NULL,
  `topic_type_scheme_id` int(11) UNSIGNED DEFAULT NULL,
  `permalink` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_menu_item`
--

CREATE TABLE `topic_menu_item` (
  `id` int(11) UNSIGNED NOT NULL,
  `topic_id` int(11) UNSIGNED NOT NULL,
  `link` varchar(250) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `topic_group_id` int(11) DEFAULT NULL,
  `topic_type_id` int(11) DEFAULT NULL,
  `topic_user_filter_id` int(11) DEFAULT NULL,
  `label` varchar(250) DEFAULT NULL,
  `label_language` char(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_tag`
--

CREATE TABLE `topic_tag` (
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_topic_type_scheme_assoc`
--

CREATE TABLE `topic_topic_type_scheme_assoc` (
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `topic_type_scheme_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_type`
--

CREATE TABLE `topic_type` (
  `id` int(10) UNSIGNED NOT NULL,
  `alias` char(30) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `topic_group_id` int(10) UNSIGNED NOT NULL,
  `allow_subtopics_yn` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `allow_comments_yn` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `label_config` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `topic_type`
--

INSERT INTO `topic_type` (`id`, `alias`, `name`, `summary`, `topic_group_id`, `allow_subtopics_yn`, `allow_comments_yn`, `label_config`) VALUES
(1, 'issue', 'Task', NULL, 1, 0, 1, NULL),
(2, 'bug', 'Bug', NULL, 1, 0, 1, 0x7b226267223a22726564363030222c22636c72223a227265643530227d),
(3, 'epic', 'Epic', 'A big user story thatshould be broken down', 1, 0, 1, NULL),
(4, 'milestone', 'Milestone', NULL, 8, 0, 1, NULL),
(5, 'project', 'Project', NULL, 9, 1, 0, NULL),
(7, 'version', 'Version', 'Versions can be released/archived', 13, 0, 0, NULL),
(8, 'announcement', 'Announcements', NULL, 4, 0, 0, NULL),
(9, 'board_topic', 'Discussion Topic', '', 4, 0, 1, NULL),
(10, 'supportTopic', 'Tech Support Question', NULL, 4, 0, 0, NULL),
(12, 'board', 'Discussion Board', NULL, 3, 1, 0, NULL),
(15, 'project_category', 'Project Category', NULL, 9, 0, 0, NULL),
(16, 'improvement', 'Improvement', NULL, 1, 0, 1, NULL),
(17, 'feature', 'New Feature', NULL, 1, 0, 1, NULL),
(18, 'sales', 'Sales Activity', 'Sales activity', 9, 1, 0, NULL),
(20, 'category', 'Category', NULL, 3, 1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topic_type_scheme`
--

CREATE TABLE `topic_type_scheme` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='This is a set of issue types that project has';

--
-- Dumping data for table `topic_type_scheme`
--

INSERT INTO `topic_type_scheme` (`id`, `name`, `is_default`) VALUES
(1, 'Software Development Default', NULL),
(2, 'Discussion Boards default', NULL),
(3, 'contextBoard', NULL),
(4, 'Projects', NULL),
(5, 'Board Topics', NULL),
(6, 'Sales Activity Default', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topic_type_scheme_topic_type_map`
--

CREATE TABLE `topic_type_scheme_topic_type_map` (
  `id` int(11) UNSIGNED NOT NULL,
  `topic_type_scheme_id` int(10) UNSIGNED NOT NULL,
  `topic_type_id` int(10) UNSIGNED NOT NULL,
  `sort_weight` smallint(5) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'order of type in scheme, heaviest on top'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `topic_type_scheme_topic_type_map`
--

INSERT INTO `topic_type_scheme_topic_type_map` (`id`, `topic_type_scheme_id`, `topic_type_id`, `sort_weight`) VALUES
(1, 1, 1, 5),
(2, 1, 2, 4),
(3, 2, 12, 2),
(4, 3, 12, 1),
(5, 4, 5, 0),
(6, 1, 3, 3),
(7, 5, 9, 0),
(8, 1, 18, 0),
(10, 2, 20, 1),
(11, 6, 18, 0);

-- --------------------------------------------------------

--
-- Table structure for table `topic_type_screen_map`
--

CREATE TABLE `topic_type_screen_map` (
  `id` int(10) UNSIGNED NOT NULL,
  `topic_type_id` int(10) UNSIGNED NOT NULL,
  `screen_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_user`
--

CREATE TABLE `topic_user` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `access_level` enum('read','own') DEFAULT NULL,
  `active_yn` tinyint(1) UNSIGNED DEFAULT NULL,
  `assigned_on` datetime DEFAULT NULL,
  `assigned_by_user_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic_user_invite`
--

CREATE TABLE `topic_user_invite` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `invited_by_user_id` int(11) NOT NULL,
  `invited_on` datetime DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `status_changed_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) UNSIGNED NOT NULL,
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
  `lastUpdated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `realm`, `username`, `password`, `credentials`, `challenges`, `email`, `emailVerified`, `verificationToken`, `status`, `created`, `lastUpdated`) VALUES
(12, NULL, 'Admin', '$2a$10$.HISWzGAFPq8wHlffjOqbuxZ5VtkAAKTGavRjTOd20sJEW3PHhxcS', NULL, NULL, 'admin@brainfock.com', NULL, NULL, NULL, NULL, NULL),
(22, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(23, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(24, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(25, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(26, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(27, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(28, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(29, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(30, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(31, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(32, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL),
(33, NULL, NULL, '', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
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
  `lastUpdated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `realm`, `username`, `password`, `credentials`, `challenges`, `email`, `emailVerified`, `verificationToken`, `status`, `created`, `lastUpdated`) VALUES
(1, NULL, 'John', '$2a$10$hyT/6aEKnwMaX0Aw6e.l.eogUSxIQBuerbpwaEJGAmAKmgNcY1QH6', NULL, NULL, 'john@doe.com', NULL, NULL, NULL, NULL, NULL),
(2, NULL, 'Jane', '$2a$10$TmOn0kwF20nyV7/zhCKf3.PTWsw2NvV5i5bZppXs31JBDKqirzp4K', NULL, NULL, 'jane@doe.com', NULL, NULL, NULL, NULL, NULL),
(3, NULL, 'Admin', '$2a$10$pK7emoINW.il2jgz3OLBUeziQeIReJqfgi6yK67aBbSq6QNE7ZCRS', NULL, NULL, 'admin@brainfock.com', NULL, NULL, NULL, NULL, NULL),
(4, NULL, 'Bob', '$2a$10$Z2pEM/RwBNFy2sjSrUCugOwBs48.pp23RkOuX7fiP6y6u0VBD8646', NULL, NULL, 'bob@projects.com', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_topic`
--

CREATE TABLE `user_topic` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `topic_id` bigint(14) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `access_level` enum('read','own') DEFAULT NULL,
  `active_yn` tinyint(1) UNSIGNED DEFAULT NULL,
  `assigned_on` datetime DEFAULT NULL,
  `assigned_by_user_id` int(11) UNSIGNED DEFAULT NULL,
  `starred_yn` tinyint(1) UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_workspace`
--

CREATE TABLE `user_workspace` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `workspace_id` int(11) UNSIGNED NOT NULL,
  `access_level` enum('read','own') DEFAULT NULL,
  `active_yn` tinyint(1) UNSIGNED DEFAULT NULL,
  `assigned_on` datetime DEFAULT NULL,
  `assigned_by_user_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `view_screen`
--

CREATE TABLE `view_screen` (
  `id` int(11) UNSIGNED NOT NULL,
  `view` varchar(250) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL COMMENT 'Name in menu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `view_screen`
--

INSERT INTO `view_screen` (`id`, `view`, `name`) VALUES
(1, 'views/space/index', 'Workspace Index (projects)'),
(3, NULL, 'Master-Detail view');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_comment`
-- (See below for the actual view)
--
CREATE TABLE `v_comment` (
`owner_user_id` int(11) unsigned
,`access_private_yn` tinyint(3) unsigned
,`id` int(12) unsigned
,`parent_id` int(12) unsigned
,`thread_id` int(12) unsigned
,`entity_id` int(12) unsigned
,`author_id` int(10) unsigned
,`authorIp` varchar(250)
,`author_ip_long` int(10)
,`text` text
,`text_hash` varchar(32)
,`created_on` datetime
,`deleted` tinyint(1)
,`status` enum('pending','deleted','approved')
,`rating` float
,`count_positive_votes` int(10) unsigned
,`count_negative_votes` int(10) unsigned
,`notify_me` tinyint(1)
,`level` smallint(5) unsigned
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_topic`
-- (See below for the actual view)
--
CREATE TABLE `v_topic` (
`id` bigint(14) unsigned
,`group_key` varchar(255)
,`milestone_topic_id` int(11)
,`entity_id` bigint(14) unsigned
,`group_id` int(10) unsigned
,`type_id` int(10) unsigned
,`workflow_stage_id` int(11) unsigned
,`status` enum('closed','open','progress')
,`closed_yn` tinyint(1) unsigned
,`closed_on` datetime
,`deleted_yn` tinyint(1) unsigned
,`deleted_on` datetime
,`parent_topic_id` bigint(14) unsigned
,`sort_order` smallint(5) unsigned
,`context_topic_id` bigint(14) unsigned
,`context_topic_num` smallint(5) unsigned
,`context_topic_key` varchar(100)
,`summary` varchar(255)
,`count_comments` smallint(5) unsigned
,`owner_user_id` int(10) unsigned
,`access_private_yn` tinyint(1) unsigned
,`assigned_user_id` int(10) unsigned
,`text` text
,`submitted_on` datetime
,`created_on` datetime
,`updated_on` timestamp
,`due_date` datetime
,`logo_icon` varchar(50)
,`logo_background` varchar(50)
,`completed_percentage` varchar(100)
,`workspace_id` int(11) unsigned
,`owner_namespace` varchar(255)
,`wf_stage` varchar(255)
,`wf_status` enum('open','progress','closed')
,`submitted_user_id` int(10)
,`group_scheme_id` int(10) unsigned
,`priority_id` int(10) unsigned
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_user_topic`
-- (See below for the actual view)
--
CREATE TABLE `v_user_topic` (
`user_id` int(11) unsigned
,`topic_id` bigint(14) unsigned
);

-- --------------------------------------------------------

--
-- Table structure for table `wiki_link`
--

CREATE TABLE `wiki_link` (
  `id` int(11) NOT NULL,
  `page_from_id` int(11) NOT NULL,
  `page_to_id` int(11) DEFAULT NULL,
  `wiki_uid` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `wiki_page`
--

CREATE TABLE `wiki_page` (
  `id` int(11) NOT NULL,
  `entity_id` bigint(14) UNSIGNED DEFAULT NULL,
  `context_entity_id` bigint(14) UNSIGNED NOT NULL DEFAULT '0',
  `is_redirect` tinyint(1) DEFAULT '0',
  `page_uid` varchar(255) DEFAULT NULL,
  `namespace` varchar(255) DEFAULT NULL,
  `content` text,
  `revision_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tree_root` int(11) UNSIGNED DEFAULT NULL,
  `tree_lt` int(11) UNSIGNED DEFAULT NULL,
  `tree_rt` int(11) UNSIGNED DEFAULT NULL,
  `tree_level` mediumint(5) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `show_children_tree` tinyint(1) UNSIGNED DEFAULT '0',
  `deleted_yn` tinyint(1) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `wiki_page_revision`
--

CREATE TABLE `wiki_page_revision` (
  `id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `is_minor` tinyint(1) DEFAULT NULL,
  `content` text,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Stand-in structure for view `wiki_page_view`
-- (See below for the actual view)
--
CREATE TABLE `wiki_page_view` (
`owner_user_id` int(11) unsigned
,`access_private_yn` tinyint(3) unsigned
,`id` int(11)
,`entity_id` bigint(14) unsigned
,`context_entity_id` bigint(14) unsigned
,`is_redirect` tinyint(1)
,`page_uid` varchar(255)
,`namespace` varchar(255)
,`content` text
,`revision_id` int(11)
,`user_id` varchar(255)
,`name` varchar(255)
,`deleted_yn` tinyint(1) unsigned
,`updated_on` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `workflow`
--

CREATE TABLE `workflow` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `active_yn` tinyint(1) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workflow`
--

INSERT INTO `workflow` (`id`, `name`, `summary`, `active_yn`) VALUES
(1, 'Simple Workflow', 'The most basic workflow, having three statuses', 1),
(2, 'Discussion Topic Workflow', 'Simple workflow for forum topics: open & closed', NULL),
(3, 'Advanced Discussions', 'Wf for a more advanced board, including pre-moderated topics, mergin etc.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workflow_instance`
--

CREATE TABLE `workflow_instance` (
  `id` bigint(14) UNSIGNED NOT NULL,
  `entity_id` bigint(14) UNSIGNED DEFAULT NULL,
  `workflow_stage_id` int(11) UNSIGNED DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `workflow_operation`
--

CREATE TABLE `workflow_operation` (
  `id` int(10) UNSIGNED NOT NULL,
  `workflow_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `outgoing_stage_id` int(10) UNSIGNED NOT NULL,
  `biz_template` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workflow_operation`
--

INSERT INTO `workflow_operation` (`id`, `workflow_id`, `name`, `summary`, `outgoing_stage_id`, `biz_template`) VALUES
(1, 1, 'Begin Progress', 'Put issue in progress', 2, NULL),
(2, 1, 'Close Issue', 'Mark issue as closed', 3, NULL),
(3, 1, 'Reopen Issue', NULL, 4, NULL),
(5, 1, 'Pause & Backlog', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workflow_scheme`
--

CREATE TABLE `workflow_scheme` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `summary` varchar(250) DEFAULT NULL,
  `default_workflow_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workflow_scheme`
--

INSERT INTO `workflow_scheme` (`id`, `name`, `summary`, `default_workflow_id`) VALUES
(1, 'Default Scheme', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `workflow_scheme_topic_type_workflow_map`
--

CREATE TABLE `workflow_scheme_topic_type_workflow_map` (
  `id` int(10) UNSIGNED NOT NULL,
  `workflow_scheme_id` int(10) UNSIGNED NOT NULL,
  `topic_type_id` int(10) UNSIGNED NOT NULL,
  `workflow_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workflow_scheme_topic_type_workflow_map`
--

INSERT INTO `workflow_scheme_topic_type_workflow_map` (`id`, `workflow_scheme_id`, `topic_type_id`, `workflow_id`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 1, 3, 1),
(4, 1, 4, 1),
(5, 1, 5, 1),
(7, 1, 16, 1),
(8, 1, 17, 1);

-- --------------------------------------------------------

--
-- Table structure for table `workflow_stage`
--

CREATE TABLE `workflow_stage` (
  `id` int(11) UNSIGNED NOT NULL,
  `workflow_id` int(11) UNSIGNED NOT NULL,
  `is_initial` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `biz_status` enum('open','progress','closed') NOT NULL COMMENT 'open - new issue, progress - issue is being worked on, closed - issue is closed',
  `status_term_value_id` int(10) UNSIGNED DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workflow_stage`
--

INSERT INTO `workflow_stage` (`id`, `workflow_id`, `is_initial`, `biz_status`, `status_term_value_id`, `summary`) VALUES
(1, 1, 1, 'open', 1, 'Issue in Backlog, initial stage'),
(2, 1, 0, 'progress', 2, 'Issue is being worked on'),
(3, 1, 0, 'closed', 3, 'Issue is resolved / closed'),
(4, 1, 0, 'open', 4, 'Issue is waiting to be resolved');

-- --------------------------------------------------------

--
-- Table structure for table `workflow_stage_operation_map`
--

CREATE TABLE `workflow_stage_operation_map` (
  `id` int(10) UNSIGNED NOT NULL,
  `workflow_id` int(10) UNSIGNED NOT NULL,
  `workflow_stage_id` int(10) UNSIGNED NOT NULL,
  `workflow_operation_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workflow_stage_operation_map`
--

INSERT INTO `workflow_stage_operation_map` (`id`, `workflow_id`, `workflow_stage_id`, `workflow_operation_id`) VALUES
(2, 1, 1, 1),
(3, 1, 2, 2),
(4, 1, 3, 3),
(5, 1, 2, 5),
(6, 1, 4, 1),
(7, 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `workspace`
--

CREATE TABLE `workspace` (
  `id` int(11) UNSIGNED NOT NULL,
  `namespace` varchar(100) NOT NULL DEFAULT 'namespace',
  `name` varchar(250) DEFAULT 'name',
  `owner_user_id` int(11) UNSIGNED DEFAULT '1',
  `access_private_yn` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `private_yn` tinyint(1) DEFAULT '0' COMMENT 'Private is only available to owner user',
  `topic_group_scheme_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure for view `v_comment`
--
DROP TABLE IF EXISTS `v_comment`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_comment`  AS  select `entity`.`owner_user_id` AS `owner_user_id`,`entity`.`access_private_yn` AS `access_private_yn`,`comment`.`id` AS `id`,`comment`.`parent_id` AS `parent_id`,`comment`.`thread_id` AS `thread_id`,`comment`.`entity_id` AS `entity_id`,`comment`.`author_id` AS `author_id`,`comment`.`authorIp` AS `authorIp`,`comment`.`author_ip_long` AS `author_ip_long`,`comment`.`text` AS `text`,`comment`.`text_hash` AS `text_hash`,`comment`.`created_on` AS `created_on`,`comment`.`deleted` AS `deleted`,`comment`.`status` AS `status`,`comment`.`rating` AS `rating`,`comment`.`count_positive_votes` AS `count_positive_votes`,`comment`.`count_negative_votes` AS `count_negative_votes`,`comment`.`notify_me` AS `notify_me`,`comment`.`level` AS `level` from (`comment` join `entity` on((`entity`.`id` = `comment`.`entity_id`))) ;

-- --------------------------------------------------------

--
-- Structure for view `v_topic`
--
DROP TABLE IF EXISTS `v_topic`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_topic`  AS  select `topic`.`id` AS `id`,`topic_group`.`group_key` AS `group_key`,`topic`.`milestone_topic_id` AS `milestone_topic_id`,`topic`.`entity_id` AS `entity_id`,`topic`.`group_id` AS `group_id`,`topic`.`type_id` AS `type_id`,`topic`.`workflow_stage_id` AS `workflow_stage_id`,`topic`.`status` AS `status`,`topic`.`closed_yn` AS `closed_yn`,`topic`.`closed_on` AS `closed_on`,`topic`.`deleted_yn` AS `deleted_yn`,`topic`.`deleted_on` AS `deleted_on`,`topic`.`parent_topic_id` AS `parent_topic_id`,`topic`.`sort_order` AS `sort_order`,`topic`.`context_topic_id` AS `context_topic_id`,`topic`.`context_topic_num` AS `context_topic_num`,`topic`.`context_topic_key` AS `context_topic_key`,`topic`.`summary` AS `summary`,`topic`.`count_comments` AS `count_comments`,`topic`.`owner_user_id` AS `owner_user_id`,`topic`.`access_private_yn` AS `access_private_yn`,`topic`.`assigned_user_id` AS `assigned_user_id`,`topic`.`text` AS `text`,`topic`.`submitted_on` AS `submitted_on`,`topic`.`created_on` AS `created_on`,`topic`.`updated_on` AS `updated_on`,`topic`.`due_date` AS `due_date`,`topic`.`logo_icon` AS `logo_icon`,`topic`.`logo_background` AS `logo_background`,`topic`.`completed_percentage` AS `completed_percentage`,`topic`.`workspace_id` AS `workspace_id`,`topic`.`owner_namespace` AS `owner_namespace`,`term_value`.`value` AS `wf_stage`,`workflow_stage`.`biz_status` AS `wf_status`,`topic`.`submitted_user_id` AS `submitted_user_id`,`topic`.`group_scheme_id` AS `group_scheme_id`,`topic`.`priority_id` AS `priority_id` from (((`topic` join `topic_group` on((`topic`.`group_id` = `topic_group`.`id`))) join `workflow_stage` on((`topic`.`workflow_stage_id` = `workflow_stage`.`id`))) join `term_value` on((`workflow_stage`.`status_term_value_id` = `term_value`.`id`))) ;

-- --------------------------------------------------------

--
-- Structure for view `v_user_topic`
--
DROP TABLE IF EXISTS `v_user_topic`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_topic`  AS  select `usr`.`id` AS `user_id`,`topic`.`id` AS `topic_id` from (`user` `usr` join (`topic` left join `topic_user` `u` on((`u`.`topic_id` = `topic`.`id`)))) where ((`u`.`user_id` is not null) or (`topic`.`access_private_yn` = 0)) group by `usr`.`id`,`topic`.`id` ;

-- --------------------------------------------------------

--
-- Structure for view `wiki_page_view`
--
DROP TABLE IF EXISTS `wiki_page_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `wiki_page_view`  AS  select `entity`.`owner_user_id` AS `owner_user_id`,`entity`.`access_private_yn` AS `access_private_yn`,`wiki_page`.`id` AS `id`,`wiki_page`.`entity_id` AS `entity_id`,`wiki_page`.`context_entity_id` AS `context_entity_id`,`wiki_page`.`is_redirect` AS `is_redirect`,`wiki_page`.`page_uid` AS `page_uid`,`wiki_page`.`namespace` AS `namespace`,`wiki_page`.`content` AS `content`,`wiki_page`.`revision_id` AS `revision_id`,`wiki_page`.`user_id` AS `user_id`,`wiki_page`.`name` AS `name`,`wiki_page`.`deleted_yn` AS `deleted_yn`,`wiki_page`.`updated_on` AS `updated_on` from (`wiki_page` join `entity` on((`entity`.`id` = `wiki_page`.`entity_id`))) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AccessToken`
--
ALTER TABLE `AccessToken`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accesstoken`
--
ALTER TABLE `accesstoken`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ACL`
--
ALTER TABLE `ACL`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `acl`
--
ALTER TABLE `acl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `activitystream_template`
--
ALTER TABLE `activitystream_template`
  ADD KEY `id` (`id`);

--
-- Indexes for table `activitystream_topictype_action_template`
--
ALTER TABLE `activitystream_topictype_action_template`
  ADD KEY `activity_template_id` (`activity_template_id`),
  ADD KEY `topic_type_id` (`topic_type_id`);

--
-- Indexes for table `activity_stream_entity_feed`
--
ALTER TABLE `activity_stream_entity_feed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stream_event_id` (`stream_event_id`,`entity_id`) USING BTREE,
  ADD KEY `entity_id` (`entity_id`);

--
-- Indexes for table `activity_stream_event`
--
ALTER TABLE `activity_stream_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `activity_stream_project_feed`
--
ALTER TABLE `activity_stream_project_feed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stream_event_id` (`stream_event_id`,`project_id`);

--
-- Indexes for table `app_routes`
--
ALTER TABLE `app_routes`
  ADD PRIMARY KEY (`id`,`name`),
  ADD KEY `id` (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`author_id`) USING BTREE,
  ADD KEY `comment_pid` (`parent_id`) USING BTREE,
  ADD KEY `comment_delete` (`deleted`) USING BTREE,
  ADD KEY `rating_date_id` (`rating`,`created_on`,`id`) USING BTREE,
  ADD KEY `comment_status` (`status`) USING BTREE;

--
-- Indexes for table `comment_revision`
--
ALTER TABLE `comment_revision`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_revision_comment_revision` (`comment_id`,`revision`) USING BTREE;

--
-- Indexes for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dashboard_widget`
--
ALTER TABLE `dashboard_widget`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `entity`
--
ALTER TABLE `entity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `entity_access_assign`
--
ALTER TABLE `entity_access_assign`
  ADD PRIMARY KEY (`auth_type`,`auth_id`,`entity_id`);

--
-- Indexes for table `entity_available_feature`
--
ALTER TABLE `entity_available_feature`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entity_menu_id` (`entity_menu_id`);

--
-- Indexes for table `entity_feature`
--
ALTER TABLE `entity_feature`
  ADD PRIMARY KEY (`id`,`entity_id`),
  ADD KEY `entity_id` (`entity_id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `entity_menu`
--
ALTER TABLE `entity_menu`
  ADD PRIMARY KEY (`id`,`entity_id`),
  ADD KEY `entity_id` (`entity_id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `entity_menu_item`
--
ALTER TABLE `entity_menu_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entity_menu_id` (`entity_menu_id`);

--
-- Indexes for table `entity_workflow_operation`
--
ALTER TABLE `entity_workflow_operation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entity_id` (`entity_id`),
  ADD KEY `workflow_operation_id` (`workflow_operation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `in_stage_id` (`in_stage_id`),
  ADD KEY `out_stage_id` (`out_stage_id`);

--
-- Indexes for table `field`
--
ALTER TABLE `field`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `filter_field`
--
ALTER TABLE `filter_field`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `filter_preset`
--
ALTER TABLE `filter_preset`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Role`
--
ALTER TABLE `Role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `RoleMapping`
--
ALTER TABLE `RoleMapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `principalId` (`principalId`);

--
-- Indexes for table `rolemapping`
--
ALTER TABLE `rolemapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `screen`
--
ALTER TABLE `screen`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `screen_field`
--
ALTER TABLE `screen_field`
  ADD PRIMARY KEY (`id`),
  ADD KEY `screen_id` (`screen_id`),
  ADD KEY `field_id` (`field_id`);

--
-- Indexes for table `screen_scheme`
--
ALTER TABLE `screen_scheme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `default_screen_id` (`default_screen_id`);

--
-- Indexes for table `screen_scheme_topic_type_screen_map`
--
ALTER TABLE `screen_scheme_topic_type_screen_map`
  ADD PRIMARY KEY (`id`),
  ADD KEY `screen_scheme_id` (`screen_scheme_id`),
  ADD KEY `topic_type_id` (`topic_type_id`),
  ADD KEY `screen_id` (`screen_id`);

--
-- Indexes for table `sequence`
--
ALTER TABLE `sequence`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `owner_topic_id` (`owner_topic_id`,`topic_group_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_key` (`category`,`key`) USING BTREE;

--
-- Indexes for table `settings_field`
--
ALTER TABLE `settings_field`
  ADD PRIMARY KEY (`id`,`category_key`),
  ADD UNIQUE KEY `id` (`id`,`category_key`);

--
-- Indexes for table `term`
--
ALTER TABLE `term`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workspace_id` (`workspace_id`);

--
-- Indexes for table `term_value`
--
ALTER TABLE `term_value`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic`
--
ALTER TABLE `topic`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `context_topic_id` (`context_topic_id`,`context_topic_key`),
  ADD UNIQUE KEY `context_topic_id_2` (`context_topic_id`,`context_topic_num`,`group_id`),
  ADD KEY `deleted_yn` (`deleted_yn`,`context_topic_id`,`closed_yn`,`owner_user_id`,`access_private_yn`) USING BTREE,
  ADD KEY `type_id` (`type_id`) USING BTREE,
  ADD KEY `workflow_stage_id` (`workflow_stage_id`) USING BTREE,
  ADD KEY `entity_id` (`entity_id`),
  ADD KEY `group_scheme_id` (`group_scheme_id`),
  ADD KEY `workspace_id` (`workspace_id`);

--
-- Indexes for table `topic_category`
--
ALTER TABLE `topic_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_context`
--
ALTER TABLE `topic_context`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`) USING BTREE,
  ADD KEY `workflow_stage_id` (`workflow_stage_id`) USING BTREE,
  ADD KEY `entity_id` (`entity_id`),
  ADD KEY `group_scheme_id` (`group_scheme_id`),
  ADD KEY `workspace_id` (`workspace_id`);

--
-- Indexes for table `topic_field_value`
--
ALTER TABLE `topic_field_value`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_group`
--
ALTER TABLE `topic_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_group_scheme`
--
ALTER TABLE `topic_group_scheme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `is_default` (`is_default`),
  ADD KEY `root_group_id` (`root_group_id`);

--
-- Indexes for table `topic_group_scheme_group_map`
--
ALTER TABLE `topic_group_scheme_group_map`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_group_scheme_type_scheme_map`
--
ALTER TABLE `topic_group_scheme_type_scheme_map`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_instance_group_scheme`
--
ALTER TABLE `topic_instance_group_scheme`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_instance_menu`
--
ALTER TABLE `topic_instance_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_menu_item`
--
ALTER TABLE `topic_menu_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entity_menu_id` (`topic_id`);

--
-- Indexes for table `topic_tag`
--
ALTER TABLE `topic_tag`
  ADD UNIQUE KEY `tag_ticket` (`topic_id`,`tag_id`) USING BTREE;

--
-- Indexes for table `topic_topic_type_scheme_assoc`
--
ALTER TABLE `topic_topic_type_scheme_assoc`
  ADD PRIMARY KEY (`topic_id`,`topic_type_scheme_id`),
  ADD KEY `topic_type_scheme_id` (`topic_type_scheme_id`);

--
-- Indexes for table `topic_type`
--
ALTER TABLE `topic_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `topic_group_id` (`topic_group_id`) USING BTREE;

--
-- Indexes for table `topic_type_scheme`
--
ALTER TABLE `topic_type_scheme`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_type_scheme_topic_type_map`
--
ALTER TABLE `topic_type_scheme_topic_type_map`
  ADD PRIMARY KEY (`id`),
  ADD KEY `topic_type_id` (`topic_type_id`) USING BTREE,
  ADD KEY `topic_type_scheme_id` (`topic_type_scheme_id`) USING BTREE;

--
-- Indexes for table `topic_type_screen_map`
--
ALTER TABLE `topic_type_screen_map`
  ADD PRIMARY KEY (`id`),
  ADD KEY `topic_type_id` (`topic_type_id`),
  ADD KEY `screen_id` (`screen_id`);

--
-- Indexes for table `topic_user`
--
ALTER TABLE `topic_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_user_invite`
--
ALTER TABLE `topic_user_invite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`topic_id`,`user_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_topic`
--
ALTER TABLE `user_topic`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_workspace`
--
ALTER TABLE `user_workspace`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `view_screen`
--
ALTER TABLE `view_screen`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wiki_link`
--
ALTER TABLE `wiki_link`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wiki_fk_link_page_from` (`page_from_id`) USING BTREE,
  ADD KEY `wiki_fk_link_page_to` (`page_to_id`) USING BTREE;

--
-- Indexes for table `wiki_page`
--
ALTER TABLE `wiki_page`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wiki_idx_page_page_uid` (`page_uid`,`context_entity_id`,`namespace`) USING BTREE,
  ADD KEY `wiki_idx_page_namespace` (`namespace`) USING BTREE,
  ADD KEY `wiki_page_tree_root` (`tree_root`) USING BTREE,
  ADD KEY `wiki_page_tree_lt` (`tree_lt`) USING BTREE,
  ADD KEY `wiki_page_tree_rt` (`tree_rt`) USING BTREE,
  ADD KEY `wiki_page_tree_level` (`tree_level`) USING BTREE,
  ADD KEY `wiki_page_deleted_yn` (`deleted_yn`) USING BTREE;

--
-- Indexes for table `wiki_page_revision`
--
ALTER TABLE `wiki_page_revision`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wiki_fk_page_revision_page` (`page_id`) USING BTREE;

--
-- Indexes for table `workflow`
--
ALTER TABLE `workflow`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workflow_instance`
--
ALTER TABLE `workflow_instance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workflow_operation`
--
ALTER TABLE `workflow_operation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow_id` (`workflow_id`),
  ADD KEY `outgoing_stage_id` (`outgoing_stage_id`);

--
-- Indexes for table `workflow_scheme`
--
ALTER TABLE `workflow_scheme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `default_workflow_id` (`default_workflow_id`);

--
-- Indexes for table `workflow_scheme_topic_type_workflow_map`
--
ALTER TABLE `workflow_scheme_topic_type_workflow_map`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow_scheme_id` (`workflow_scheme_id`),
  ADD KEY `topic_type_id` (`topic_type_id`),
  ADD KEY `workflow_id` (`workflow_id`);

--
-- Indexes for table `workflow_stage`
--
ALTER TABLE `workflow_stage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status_term_value_id` (`status_term_value_id`),
  ADD KEY `workflow_id` (`workflow_id`),
  ADD KEY `workflow_id_2` (`workflow_id`,`is_initial`);

--
-- Indexes for table `workflow_stage_operation_map`
--
ALTER TABLE `workflow_stage_operation_map`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow_id` (`workflow_id`) USING BTREE,
  ADD KEY `workflow_stage_id` (`workflow_stage_id`) USING BTREE,
  ADD KEY `workflow_operation_id` (`workflow_operation_id`) USING BTREE;

--
-- Indexes for table `workspace`
--
ALTER TABLE `workspace`
  ADD PRIMARY KEY (`id`,`namespace`),
  ADD KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ACL`
--
ALTER TABLE `ACL`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `acl`
--
ALTER TABLE `acl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `activity_stream_entity_feed`
--
ALTER TABLE `activity_stream_entity_feed`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `activity_stream_event`
--
ALTER TABLE `activity_stream_event`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2311;
--
-- AUTO_INCREMENT for table `activity_stream_project_feed`
--
ALTER TABLE `activity_stream_project_feed`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=956;
--
-- AUTO_INCREMENT for table `app_routes`
--
ALTER TABLE `app_routes`
  MODIFY `id` mediumint(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(12) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `comment_revision`
--
ALTER TABLE `comment_revision`
  MODIFY `id` bigint(12) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `dashboard_widget`
--
ALTER TABLE `dashboard_widget`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `entity`
--
ALTER TABLE `entity`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `entity_available_feature`
--
ALTER TABLE `entity_available_feature`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `entity_feature`
--
ALTER TABLE `entity_feature`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `entity_menu`
--
ALTER TABLE `entity_menu`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `entity_menu_item`
--
ALTER TABLE `entity_menu_item`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `entity_workflow_operation`
--
ALTER TABLE `entity_workflow_operation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `field`
--
ALTER TABLE `field`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `filter_field`
--
ALTER TABLE `filter_field`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `filter_preset`
--
ALTER TABLE `filter_preset`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `Role`
--
ALTER TABLE `Role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `RoleMapping`
--
ALTER TABLE `RoleMapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `rolemapping`
--
ALTER TABLE `rolemapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `screen`
--
ALTER TABLE `screen`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `screen_field`
--
ALTER TABLE `screen_field`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `screen_scheme`
--
ALTER TABLE `screen_scheme`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `screen_scheme_topic_type_screen_map`
--
ALTER TABLE `screen_scheme_topic_type_screen_map`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `sequence`
--
ALTER TABLE `sequence`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `term`
--
ALTER TABLE `term`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `term_value`
--
ALTER TABLE `term_value`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `topic`
--
ALTER TABLE `topic`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_category`
--
ALTER TABLE `topic_category`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_context`
--
ALTER TABLE `topic_context`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_field_value`
--
ALTER TABLE `topic_field_value`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_group`
--
ALTER TABLE `topic_group`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `topic_group_scheme`
--
ALTER TABLE `topic_group_scheme`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `topic_group_scheme_group_map`
--
ALTER TABLE `topic_group_scheme_group_map`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `topic_group_scheme_type_scheme_map`
--
ALTER TABLE `topic_group_scheme_type_scheme_map`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `topic_instance_group_scheme`
--
ALTER TABLE `topic_instance_group_scheme`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_instance_menu`
--
ALTER TABLE `topic_instance_menu`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_menu_item`
--
ALTER TABLE `topic_menu_item`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_type`
--
ALTER TABLE `topic_type`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `topic_type_scheme`
--
ALTER TABLE `topic_type_scheme`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `topic_type_scheme_topic_type_map`
--
ALTER TABLE `topic_type_scheme_topic_type_map`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `topic_type_screen_map`
--
ALTER TABLE `topic_type_screen_map`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_user`
--
ALTER TABLE `topic_user`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topic_user_invite`
--
ALTER TABLE `topic_user_invite`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `user_topic`
--
ALTER TABLE `user_topic`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user_workspace`
--
ALTER TABLE `user_workspace`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `view_screen`
--
ALTER TABLE `view_screen`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `wiki_link`
--
ALTER TABLE `wiki_link`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `wiki_page`
--
ALTER TABLE `wiki_page`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `wiki_page_revision`
--
ALTER TABLE `wiki_page_revision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `workflow`
--
ALTER TABLE `workflow`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `workflow_instance`
--
ALTER TABLE `workflow_instance`
  MODIFY `id` bigint(14) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `workflow_operation`
--
ALTER TABLE `workflow_operation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `workflow_scheme`
--
ALTER TABLE `workflow_scheme`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `workflow_scheme_topic_type_workflow_map`
--
ALTER TABLE `workflow_scheme_topic_type_workflow_map`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `workflow_stage`
--
ALTER TABLE `workflow_stage`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `workflow_stage_operation_map`
--
ALTER TABLE `workflow_stage_operation_map`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `workspace`
--
ALTER TABLE `workspace`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `activitystream_topictype_action_template`
--
ALTER TABLE `activitystream_topictype_action_template`
  ADD CONSTRAINT `activitystream_topictype_action_template_ibfk_1` FOREIGN KEY (`activity_template_id`) REFERENCES `activitystream_template` (`id`),
  ADD CONSTRAINT `activitystream_topictype_action_template_ibfk_2` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`);

--
-- Constraints for table `activity_stream_entity_feed`
--
ALTER TABLE `activity_stream_entity_feed`
  ADD CONSTRAINT `activity_stream_entity_feed_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`);

--
-- Constraints for table `app_routes`
--
ALTER TABLE `app_routes`
  ADD CONSTRAINT `app_routes_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `app_routes` (`id`);

--
-- Constraints for table `entity_available_feature`
--
ALTER TABLE `entity_available_feature`
  ADD CONSTRAINT `entity_available_feature_ibfk_1` FOREIGN KEY (`entity_menu_id`) REFERENCES `entity_menu` (`id`);

--
-- Constraints for table `entity_feature`
--
ALTER TABLE `entity_feature`
  ADD CONSTRAINT `entity_feature_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`);

--
-- Constraints for table `entity_menu`
--
ALTER TABLE `entity_menu`
  ADD CONSTRAINT `entity_menu_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`);

--
-- Constraints for table `entity_menu_item`
--
ALTER TABLE `entity_menu_item`
  ADD CONSTRAINT `entity_menu_item_ibfk_1` FOREIGN KEY (`entity_menu_id`) REFERENCES `entity_menu` (`id`);

--
-- Constraints for table `entity_workflow_operation`
--
ALTER TABLE `entity_workflow_operation`
  ADD CONSTRAINT `entity_workflow_operation_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`),
  ADD CONSTRAINT `entity_workflow_operation_ibfk_2` FOREIGN KEY (`workflow_operation_id`) REFERENCES `workflow_operation` (`id`),
  ADD CONSTRAINT `entity_workflow_operation_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `entity_workflow_operation_ibfk_4` FOREIGN KEY (`in_stage_id`) REFERENCES `workflow_stage` (`id`),
  ADD CONSTRAINT `entity_workflow_operation_ibfk_5` FOREIGN KEY (`out_stage_id`) REFERENCES `workflow_stage` (`id`);

--
-- Constraints for table `screen_field`
--
ALTER TABLE `screen_field`
  ADD CONSTRAINT `screen_field_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `screen` (`id`),
  ADD CONSTRAINT `screen_field_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `field` (`id`);

--
-- Constraints for table `screen_scheme`
--
ALTER TABLE `screen_scheme`
  ADD CONSTRAINT `screen_scheme_ibfk_1` FOREIGN KEY (`default_screen_id`) REFERENCES `screen` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `screen_scheme_topic_type_screen_map`
--
ALTER TABLE `screen_scheme_topic_type_screen_map`
  ADD CONSTRAINT `screen_scheme_topic_type_screen_map_ibfk_1` FOREIGN KEY (`screen_scheme_id`) REFERENCES `screen_scheme` (`id`),
  ADD CONSTRAINT `screen_scheme_topic_type_screen_map_ibfk_2` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  ADD CONSTRAINT `screen_scheme_topic_type_screen_map_ibfk_3` FOREIGN KEY (`screen_id`) REFERENCES `screen` (`id`);

--
-- Constraints for table `term`
--
ALTER TABLE `term`
  ADD CONSTRAINT `term_ibfk_1` FOREIGN KEY (`workspace_id`) REFERENCES `workspace` (`id`);

--
-- Constraints for table `topic`
--
ALTER TABLE `topic`
  ADD CONSTRAINT `topic_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `topic_type` (`id`),
  ADD CONSTRAINT `topic_ibfk_2` FOREIGN KEY (`workflow_stage_id`) REFERENCES `workflow_stage` (`id`),
  ADD CONSTRAINT `topic_ibfk_3` FOREIGN KEY (`context_topic_id`) REFERENCES `topic` (`id`),
  ADD CONSTRAINT `topic_ibfk_4` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `topic_ibfk_5` FOREIGN KEY (`group_scheme_id`) REFERENCES `topic_group_scheme` (`id`),
  ADD CONSTRAINT `topic_ibfk_6` FOREIGN KEY (`workspace_id`) REFERENCES `workspace` (`id`);

--
-- Constraints for table `topic_context`
--
ALTER TABLE `topic_context`
  ADD CONSTRAINT `topic_context_ibfk_1` FOREIGN KEY (`workspace_id`) REFERENCES `workspace` (`id`),
  ADD CONSTRAINT `topic_context_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `topic_type` (`id`),
  ADD CONSTRAINT `topic_context_ibfk_3` FOREIGN KEY (`workflow_stage_id`) REFERENCES `workflow_stage` (`id`),
  ADD CONSTRAINT `topic_context_ibfk_4` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `topic_context_ibfk_5` FOREIGN KEY (`group_scheme_id`) REFERENCES `topic_group_scheme` (`id`);

--
-- Constraints for table `topic_group_scheme`
--
ALTER TABLE `topic_group_scheme`
  ADD CONSTRAINT `topic_group_scheme_ibfk_1` FOREIGN KEY (`root_group_id`) REFERENCES `topic_group` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `topic_topic_type_scheme_assoc`
--
ALTER TABLE `topic_topic_type_scheme_assoc`
  ADD CONSTRAINT `topic_topic_type_scheme_assoc_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`),
  ADD CONSTRAINT `topic_topic_type_scheme_assoc_ibfk_2` FOREIGN KEY (`topic_type_scheme_id`) REFERENCES `topic_type_scheme` (`id`);

--
-- Constraints for table `topic_type`
--
ALTER TABLE `topic_type`
  ADD CONSTRAINT `topic_type_ibfk_1` FOREIGN KEY (`topic_group_id`) REFERENCES `topic_group` (`id`);

--
-- Constraints for table `topic_type_scheme_topic_type_map`
--
ALTER TABLE `topic_type_scheme_topic_type_map`
  ADD CONSTRAINT `topic_type_scheme_topic_type_map_ibfk_1` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  ADD CONSTRAINT `topic_type_scheme_topic_type_map_ibfk_2` FOREIGN KEY (`topic_type_scheme_id`) REFERENCES `topic_type_scheme` (`id`);

--
-- Constraints for table `topic_type_screen_map`
--
ALTER TABLE `topic_type_screen_map`
  ADD CONSTRAINT `topic_type_screen_map_ibfk_1` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  ADD CONSTRAINT `topic_type_screen_map_ibfk_2` FOREIGN KEY (`screen_id`) REFERENCES `view_screen` (`id`);

--
-- Constraints for table `topic_user_invite`
--
ALTER TABLE `topic_user_invite`
  ADD CONSTRAINT `topic_user_invite_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`),
  ADD CONSTRAINT `topic_user_invite_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `wiki_link`
--
ALTER TABLE `wiki_link`
  ADD CONSTRAINT `wiki_link_ibfk_1` FOREIGN KEY (`page_from_id`) REFERENCES `wiki_page` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wiki_link_ibfk_2` FOREIGN KEY (`page_to_id`) REFERENCES `wiki_page` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `wiki_page_revision`
--
ALTER TABLE `wiki_page_revision`
  ADD CONSTRAINT `wiki_page_revision_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `wiki_page` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `workflow_operation`
--
ALTER TABLE `workflow_operation`
  ADD CONSTRAINT `workflow_operation_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`),
  ADD CONSTRAINT `workflow_operation_ibfk_2` FOREIGN KEY (`outgoing_stage_id`) REFERENCES `workflow_stage` (`id`);

--
-- Constraints for table `workflow_scheme`
--
ALTER TABLE `workflow_scheme`
  ADD CONSTRAINT `workflow_scheme_ibfk_1` FOREIGN KEY (`default_workflow_id`) REFERENCES `workflow` (`id`);

--
-- Constraints for table `workflow_scheme_topic_type_workflow_map`
--
ALTER TABLE `workflow_scheme_topic_type_workflow_map`
  ADD CONSTRAINT `workflow_scheme_topic_type_workflow_map_ibfk_1` FOREIGN KEY (`workflow_scheme_id`) REFERENCES `workflow_scheme` (`id`),
  ADD CONSTRAINT `workflow_scheme_topic_type_workflow_map_ibfk_2` FOREIGN KEY (`topic_type_id`) REFERENCES `topic_type` (`id`),
  ADD CONSTRAINT `workflow_scheme_topic_type_workflow_map_ibfk_3` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`);

--
-- Constraints for table `workflow_stage`
--
ALTER TABLE `workflow_stage`
  ADD CONSTRAINT `workflow_stage_ibfk_1` FOREIGN KEY (`status_term_value_id`) REFERENCES `term_value` (`id`),
  ADD CONSTRAINT `workflow_stage_ibfk_2` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`);

--
-- Constraints for table `workflow_stage_operation_map`
--
ALTER TABLE `workflow_stage_operation_map`
  ADD CONSTRAINT `workflow_stage_operation_map_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflow` (`id`),
  ADD CONSTRAINT `workflow_stage_operation_map_ibfk_2` FOREIGN KEY (`workflow_stage_id`) REFERENCES `workflow_stage` (`id`),
  ADD CONSTRAINT `workflow_stage_operation_map_ibfk_3` FOREIGN KEY (`workflow_operation_id`) REFERENCES `workflow_operation` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
