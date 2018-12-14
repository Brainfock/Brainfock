Changelog
=========

Summary of most notable changes in Brainfock project code. Changelog entries usually are split into `Features`, `Fixes` and `Style tweaks` sections.
When makes sense, items in these section may be subdivided by application component (e.g. `Server`, `API`, `iOS Client`).

## 15 Mar 2016; Sergii Gamaiunov <hello@webkadabra.com> v0.26.0:
* Add customizable terms to topics/issues (priority etc.)
* Improve tests stack
* Improve access control & security
* Add full Wiki support for context topics (projects etc.)
* Add simple workspaces management page to admin module
* Add dynamic & customizable menu for context topics (projects etc.)

## 10 Nov 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.25.0:
## 06 Nov 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.24.0:

## 01 Nov 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.23.0:

## 29 Oct 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.22.0:
* Add admin module

  Module takes advantage of require.ensure and does not load module files unless client requested them.
* Add workspaces module, using same techniques as in admin module
* Add script to initiate users (Demo data)

  To run, do:
  > $ node src/sever/bin/initiateUsers.js

  or
  > $ NODE_ENV=development node src/sever/bin/initiateUsers.js
* Add dynamic route resolver for root 'workspace' page, e.g. http://brianfock.org/brainfock
* Handle global errors (db connection, auth etc.) and present to user
* Improve isomorphic data fetch
* Tweak watermark Brainfock logo size
* Add `member` model (useful for admin section)
* Add `users` actions
* Add hotkey `ctrl+s` while editing wiki page
* Add "Create Workspace" page, utilizing `redux-form` (non-immutable, only suitable for simple forms)
* Add `workspace` reducer & action
* Modify `workspace` ACL to allow `Admin` role to CREATE
* Add reserved workspace namespaces config & validation & add names of all root modules to this list
* Add 'before save' hook to `Topic` model's inherit workspaceId from contextTopicId
* Modify topic group permalink template variables:
  * `/:id/` - for topic Id;
  * `/:topic_key/` - for `contextTopicKey` of a topic;
  * `/:board_key/` - for `contextTopicKey` of **parent topi**c (e.g. board or project);
  * `/:context_id/` - for `contextTopicId` (link to context topic, e.g. project or board id);
  * `/:namespace/` - topic workspace namespace.
* Loader component: Add option to render line-progress bar only, without `loading` label
* Add server data fetch for workspace homepage, fired by @fetch decorator and is isomorphic

## 25 Oct 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.21.0:

* Modify `baseUrl` app config property to store full base url with protocol and trailing slash
* Modify server-side rendering and re-factor stack
* Update project structure
* Add workspace API:
  * `api/workspaces/count`
  * `api/workspaces/[NAMESPACE]/topics`
  * `api/workspaces/[NAMESPACE]/topics/[TOPIC_KEY]`
  * `api/workspaces/[NAMESPACE]/topics/[TOPIC_ID]`
  * `api/workspaces/[NAMESPACE]/topics/[TOPIC_KEY]/topics`
  * `api/workspaces/[NAMESPACE]/topics/[TOPIC_KEY]/topics/[GROUP_KEY]/[TOPIC_NUM]`
  * `api/workspaces/[NAMESPACE]/topics/[TOPIC_KEY]/topics/count`
* Modify workspace API: allow to find workspace by namespace, e.g. `api/workspaces/brainfock`
* Add `topics` relation on `workspaces` with nestRemoting, see details at http://blog.brainfock.org/2015/10/23/loopback-tip-of-the-day-nest-remoting/
* Add validation of unique topic key in a workspace
* Modify topic `before save`: set `groupSchemeId` for root topics to default group scheme if no value is provided by user
* Add topic property `groupSchemeId`
* Modify `before save` hook - populate `namespace` value when only `workspaceId` is provided
* Add support to create root topics (e.g. project, discussion board, blog etc.)
* Add `delete` feature to topic;
* Add `RawTopic` model accessing `topic` db table for operations that are not supported by MYSQL views (e.g. delete topic via API since you can't delete from topic view table

### Fixes
* Fix: form fields (scheme) is not updated when switching between modules
* Fix: topics list API does not respond on empty database
* Fix: simple form factory's `react-select` inputs are not working
* Fix: new topic dialog form buttons are not visible on a smaller screens

##### Web Client
* SimpleFormFactory's `RemoteSelectField` component: add `endpointQueryString` property, that works together with `endpoint ` and represents filter property key for search query, e.g. `filter[where][summary]`
* TopicFieldsHandler: add field props resolver for `workspaceId`
* Improve all topic lists (projects, issues, boards) with reusable components
* Use new server-side fetching with @fetch decorator
* Add HOC wrapper for fetching component data
* Add preview to project settings page demonstrating how item will look like in a common list
* Re-factor various topics lists (project, project issues & boards, global borads)
* Add reusable master-detail component for topics
* Update `material-ui` dep version
* Change Brainfock project website link to `Brainfock:About` Wiki page
* Add component for empty `boards` list
* Add component for empty `projects` list

### Style & UI tweaks
* Modify main side nav to be open & docked at homepage
* Add Brainfock logo watermark to the bottom of a page
* Add linear progress bar and align `loading` placeholder to the center


## 20 Oct 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.20.0:

### Features
* Allow to change topic status via workflow operations.

##### Backend
* Add `author` & `owner` to `topic` relations.
* Add workflow-related models.
* Apply initial workflow stage for topic on creation. Stage is resolved based on workflow for topic type in effective scheme.
* Save current user as `submittedBy` value in `topic` (in addition to ownerId)
* Topic `groupId` value is now stored in `topic` table and is required.

##### Web Client
* `/:namespace/:board_id/:group_key/:id` route to View topic in a group by topic num (ordered)
* Add "Sign in" link for non-authenticated users
* Add highlight of active topic in project/issues list (see `setCurrentTopicMarker` action)
* Add material-ui elements to login page
* Add user nav menu with "Logout" and "My account" buttons
* Better & cleaner topic details page
* Improve error handling - show server error message on login
* Improve logout UX
* Master-detail view in project issues list
* New `Discussion Boards` module for projects, mostly to demonstrate different topic groups/types.
* Tweak `me` page  - add header with actual username & email, placeholder for features to come and sidenote
* Wiki Style tweak: remove unnecessary top padding

##### API
* New `extra.operations` filter to populate property with all available operations (if requested).
  To add `operations` to server response, provide `extra.operations` filter:
  `api/topics/1234?filter[extra][operations]`
* New endpoint to execute topic workflow operation:
  `api/topics/123/runOperation`
* Set `groupId` when topic is saved if `createGroup` is provided in `request`  as an alias to `TopicGroup.groupKey`.

### Fixes
* Handling of checked/unchecked `mui.Checkbox` component in FormFactory, new topic form and project settings form.
* Incomplete `CurrentUser` data in client on login.
* `afterRemote` hooks on topic.
* Usage of `react-select` (`value` property is required).
* Switch back to `material-ui` and dump temporary `material-ui-io` package.
* ... and many smaller fixes

## 13 Oct 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.19.0:

### Features

##### API
* Add new topic REST API endpoint `api/topics/:contextTopicKey/formFields`

  Load fields for topic `create` form screen. Available fields are based on topic type, group and group parent (if any), effective screen scheme (currently supports default scheme), and screen configuration (screen_fields in configured order). Currently, only system fields are available, but custom fields are in TODO.

* Find topics by their contextTopicKey, eg. /api/topics/BF
* REST API `GET topics/count` (filters supported via `?where[prop]=value`)
* Allow to access related topic of a topic (`api/topics/someTopic123/topics`), respecting access control (find & count methods)

##### Server
* Introduce `Workspaces` back into Brainfock. Workspaces have namespace, owner and permission settings just like any other topic
* Improve server rendering: fetch data based on components' `resolveData`` method (implemented for `Wiki` pages)
* Extend `Topics` database table view to include `wfStage` & `wfStatus` values
* Populate `Entity` for `Topic` on creation
* Production-ready datasources config (ENV's must be set, see tech readme)
* Wiki: add guest read access, provide document title (SEO), improve page save & update (backend)
* API to load available filters for topics group
* Add lacking models (TopicsGroup, Schemes etc.)
* Store configuraiton fo topic group schemes & fields schemes in Database

##### Web client
* Project settings page
* Project issues page
* Add bower config
* Add Google Analytics to environment-friendly config
* Add simple form factory component to build basic forms' UIs (based on `api/topics/*/formFields` data)
* Add form for creating new topic (in project/issues)
* Wiki: recognize internal links and navigate with react-router on a client-side
* Simple form factory for generating forms based on props
* setup catching IO comments once per app

### Fixes
*  API does not return contentRendered after `updateAttributes` operation (disappearing text after saving existing `WikiPage`)
* Fix creating record of a new wiki page when it had namespace in it
* Fix assets path for statics

### Style tweaks
* Adjust grids and lists of topics & topic issues
* Switch top navigation bar background from black to light grey
* Add LESS stylesheets to project (some may need a cleanup)
* Remove unnecessary padding in `page-with-nav` component and make it full-width

## 28 Sept 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.18.0:
+ Basic boards module, topics component
+ Topic/entity comments (with sockets)
+ Client API service helper
* fix infinite loop bug

## 26 Sept 2015; Sergii Gamaiunov <hello@webkadabra.com> v0.17.0:
+ Update to new Este dev stack, adding new react-router (1.0.x), React 0.14 (beta), React Redux, better hot reload for Webpack
+ Port wiki module to 0.17.0

## Sergii Gamaiunov <hello@webkadabra.com> v0.16.0:
+ Drop Yii backend support, introduce Node.js/Loopback backend app;
+ Change project structure
+ Login with actual Loopback API, using tokens and storing token in cookies (for client);
+ `@checkAuth` decorator, see `client/components/check-auth.js`
* bump version


# Changelog for older version of Brainfock, before `PHP -> Node.js` migration.


> Please note: Many of backend features available in versions under 0.15.* (PHP/Yii backend) may not be available in newer version of Brainfock app.
> These entries are left here for history and as a "todo"" reference. Some of features in version under 0.16 must be ported to new app.

## Sergii Gamaiunov <hello@webkadabra.com> v0.15.0:
+ Workflows, Workflow operations and stages (database tables, PHP backend to handle workflow transitions)
* Improve Wiki special "Category" namespace

## 2 Dec 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.14.0:
+ Moving to React.js-powered client!  Backbone client deprecated and dropped
+ Introduce "Topics" db scheme
* improve Wiki: add wiki links, autolinking (Crosslinks with [[SomePage]])
* improve Wiki: add special "Categories" type of namespace, that will automatically include list of pages linked to this "Category" in footer of a page
* improve Wiki parser, add new Markdown parser
* improve wiki render: add <nowiki> tag, example: `<nowiki>[[WikiHelp]]</nowiki>` &rarr; [[WikiHelp]]

## Sergii Gamaiunov <hello@webkadabra.com> v0.13.0:
+ admin module for account owner
* [#59] Add comments to milestones
* apply new (reusable) comments client view controller for planner, tickets & messages app modules
+ add "updated ticket milestone" stream event
* improve project team list
+ new user notification - when user is invited to project
* New ticket form: close form only if it's not draft save (for autosave)
* adjust new ticket form
* l10n (join)
* working on multitennancy
* + fix app login page when user is required to enter captcha
+ mention user in ticket titles (UI only)
* improve global signup process
* improve filter helper, make milstones filterable
* improve filters on list of users
* completed milestones are not overdue/nearing
* minor topic template adjustment
+ navbar: allow dynamic menu options for user nav (can be added by modules, see admin module)
* navbar about window - add app version & build info
* main nav: add support of dynamic items
* user notification are now moved to separate (backbone marionette) module.
* fix: correct handling of change of checkboxes in forms
* work in progress: navigation, superListView
* [#85] Bug: can not delete milestone
* [#71] Unify comments module - now it is reusable view components
* bug: error when deleting comment
* allow to comment project message by ENTITY
* improve forms - submit by pressing enter, not refresh page
* send form on enter
* Ticket form: dynamically update milestones options when project is changed
* update visualsearch
- remove projects dropdown form header nav
- turn off using of built version of app (has issues with some backgrid plugins, working on it)

## Sergii Gamaiunov <hello@webkadabra.com> v0.12.0:
+ JS client application modules
* improve notifications delivery
* forums: add "atMentioned" plugin
* fix project users listing
* Comment: save {$this->text} as a first comment to the topic
* [#62] Pull user notifications and show to client
* i18n improvement for navbar
* user notifications: mark as read all notificaitons of same handler for same entity
* improve comment deletion: cleanup related notifications
* add isDevEnv() global helper
* delete user notificaitons for tickets & models when those are deleted
* user notificaiton ui improements
* improve user notifications panel, add live notifications
* improve how notifications pull for user
* fix creating a new project
* improve projects dropdown
* improve user notifications dropdown ui
* improve project activity stream
* [#68] Space owner: allow to delete space
* improve navbar - render space part separately
* improve notifications dropdown CSS
* fix workspaces dropdown bug (duplicates)
+ make developer's machines not cache static files
* cleanup notificaiton if it's subject/entity is deleted
* setting up Grunt
* prepare project for grunt tasks - move all dynamic templates to static files
+ grunfile.js
+ add account name & public flag
* fix incoming date value parser
* make pace loader plugin only work when we call it (not evey ajax request)
* + console command to clear tasks deleted more than 30 days ago
* global "tasks" page is under development, make "tasks" menu available only for dev env
* improve task sorting (client)
* improve workspace tasks module
* fix navbar project dropdown
* improving "Tasks" module

## Sergii Gamaiunov <hello@webkadabra.com> v0.11.0:
+ introduce app accounts concept - account is "billable" unit
* [#56] Only Account owner and account admins (managers) should be able to create Spaces
* [#30] Add MarkDown for project description
* hotfix: migraitons to install notififcaiton & notificaiton d3elivery
* + notifications for forum messages
* porting changes from cloud_accounts branch
* update workspace creation
* improve access control - only admin and manager can create workspaces
* update user access validaiton for when listing tasts/projects tasks improve access validation for account owners etc.
* add filter to normalize data coming form backbone forms (it sends non-standard Checkbox values etc.)
* fix moving projects across lists at workspace dashboard screen
* Ticket details panel : allow to change priority; better empty milestone

## Sergii Gamaiunov <hello@webkadabra.com> v0.10.0:
+ notification system
+ notification i18n
+ notification delivery system

## Sergii Gamaiunov <hello@webkadabra.com> v0.9.3:
* update select2 lib/plugin
* tickets list: filters are visible right away
* [#31] Datepicker - make it obvious that user can change years/months
* fix list filters not being visually applied on first load
* "task" link in project menu has default filters now (open & in progress tickets)
* improve app navbar & space menu
* update select2 jquery plugin
* adjust select2 plugin styles

## Sergii Gamaiunov <hello@webkadabra.com> v0.9.2:
* UI design, making things simpler
+ send notifications to everybody who's watching task
+ automatically track tasks by author and assignee
+ improve entity_watch workflow, add subscribe_via description field

## Sergii Gamaiunov <hello@webkadabra.com> v0.9.1:
* fix EntityWatchBehavior (when deleting "Watch" relation)
* adjust Task model - user_watch attribute rules

## Sergii Gamaiunov <hello@webkadabra.com> v0.9.0:
+ New CActiveRecord behavior - EntityWatchBehavior
+ allow user to subscribe to tasks
* improve project/tasks API
+ [#40] Add ability to mention people and other models in comments
+ [#44] Posting new comment: send notificaitons to users who are mentioned in text
+ new WkdEmailTemplater helper component to helpt working with centralized email templates
+ [#45] Setup & polish email notification users are getting after ticket comment
* send comment permalink in comments mention notification

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.8:
* fix milestones date saving

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.7:
 + list view - request available filter options from server
[#41] Tasks: fix status filter
* improve TotalOpen_Tasks, Open_Tasks relations on Project model
* improve Total_Tasks, TotalOpen_Tasks relations on Multistone model
* improve projects dropdown (reset only when space is changed)
* remove nprogress js plugin
* fix milestones js model/form schema & saving of due_date field
* bug fix: when milestone is reset in details view, changes are not reflected in main list
* improve milestones detials page
* tasks list item - impvoe archive dialog texts to reflect what's really happening
 * imprpve milestone details page
* add due+date field to ticket view page

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.6:
+ add new spinner/inline progress loader
* hide sidebar on index tasks list
* improve workspace.js model relataions
* fix project links in main project dropdown menu
* improve sidebar for projects: pull projects list only when user opens
* menu first time

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.5.1:
* fix geo locations models

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.5:
* improve ReadAction.php and UpdateAction.php - return ApiAttributes
+ add new progress plugin (pace) and improve visual progress on most grids
(tickets etc.)
+ Milestones list: add progress bar
* improve superList ui - make imrpotant columns of same width
* improve CSS for ui-super-list, clean up, add table header
* improve superList UI when page is resized or dom is changed
* [#36] Bug: can not delete forum topic comment

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.4.2:
* CSS fix fir collapsed sidebar

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.4.1:
* improve app layout for smaller screens
* CSS cleanup

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.4:
[#28] Bug: parmalink to project/message topic does not work

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.3:
[#27] Messages:: can not load details of a topic

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.2:
[#24] Tasks module: allow to change milestone
[#25] Tasks module: show only tasks user has access to
* overall improvement of app/js

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.1:
+ Task::withProjectAccess() - scope to filter out only tickets that user has access to
* Tasks statuses options are now returned by server for each task

## Sergii Gamaiunov <hello@webkadabra.com> v0.8.0:
+ Tasks module

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.11:
* rename uk-uk locale to correct "ru-uk" local name (fixes i18n issues in Ukrainian app locale)
+ Ukrainian l10n file for jquery.timeago plugin

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.10:
* [#11] Project settings: increase max size of [about] field, add visual characters counter

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.9:
* improve user first login
* update user spaces list when user accepts new project invite

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.8:
+ UserEventWatch model
* allow for bigger project description
* improve tickets form (add visual  maxlength counter)
* improve dock form l10n
* do not render details panel on model sync - it interrupts inline editing flow
* css/ui cleanup & custom TODC bootstrap adjustment
* space dashboard/project deletion l10n (ru, uk)
* confirm dialog fix

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.7:
+ new common confirm view with customizable buttons set
+ tickets: copy issue title & number to clipboard
+ suggest page refresh after language settings has been changed
+ users i10n (uk)
* Unite super_list_view & detail_panel_view for tasks
* user settings l10n (ru)

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.6:
+ add system event for WebUser:onAfterTokenValidationSuccess
* improve first login experience for new users
* app recover password form is now linked tn frontend
* app login page look & feel
* fix bootstrap 2.3 PHP from component to show correct errors styles in vertical form
* fix assets names
* improve login workflow for new users

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.5:
+ allow user to switch application language
* rename "ua" locale to "uk" (correct name)

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.4:
+ allow user to change password & email (partially)
+ user dashboard - user settings form, password & email
* improve backbone-forms datepicker editor
* team list: show icon next to user that are invited but not yet joined a project
* favicon added to root to prevent default browser's behavior 404 error


## Sergii Gamaiunov <hello@webkadabra.com> v0.7.3:
+ project settings module (page)
+ project i18n nls files
* update swif-tmailer app component
* postdeploy script improved
* code & files cleanup
* improve application shim definition

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.2:
* allow to toggle sidebar
* cleanup

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.1:
* improve project user invites system (backend & frontend)
+ activity stream when project created
+ user dashboard: visual counter on how many invites user has
* improve navbar
* improve user dashborad
* open user dashboard in a modal
* improve ticket details page load (sidebar no longer disappears ranodmly)
* improve project dashboard activity pagination and live update feed
* improve project dashboard activity pagination
* activity feed backend improvement
* bug: invite empty user

## Sergii Gamaiunov <hello@webkadabra.com> v0.7.0:
+ improve project user invites system (backend & frontend)
* EntityBehavior: allow to override entity className (to prevent wrong class names for extended classes)
* backgrid added

## Sergii Gamaiunov <hello@webkadabra.com> v0.6.0:
+ change how App.active project is changed: App.projects.cursor.set(model|options)
+ new default set of task statuses: new, open, in progress, closed
+ Milestones management
+ add milestones options for tickets & filters
* stream events for message board (when topic created)
+ separate tasks lists for: active, archived and deleted items
+ submenu for sidebar
* update backbone.relations
* improvement on how space & projects models & collecitons work together
* improve app's url handling for Backbone.History
* automatically clean up stream events for deleted models
* entity access improved
+ reusable super_list details_pane view
* dock panel improved (allow to remove panels, see js view file)
+ reusable backbone-forms datepicker js component
* cleanup

## Sergii Gamaiunov <hello@webkadabra.com> v0.5.1:
+ improved access control over project stream feed - user will see only event related to entities he has access to

## Sergii Gamaiunov <hello@webkadabra.com> v0.5.0:
+ entity access introduced
+ cast stream event when new message topic is created
+ new project activiy feed
* jquery timeago i18n (dynamic, using u18n! module)
* fix filter helper - model should match any of array filters, but it has to match each selected filter at least one parameter
* css/html/js cleanup
* better filter panel

## Sergii Gamaiunov <hello@webkadabra.com> v0.4.6:
* fixed bug in list view - newly added tickets were not firing events;
  from now, newly created models via user form should raise 'created' event

## Sergii Gamaiunov <hello@webkadabra.com> v0.4.5:
* css & layout for event/comment feed on task details page

## Sergii Gamaiunov <hello@webkadabra.com> v0.4.4:
* "live" polling of new comments at tickets comments

## Sergii Gamaiunov <hello@webkadabra.com> v0.4.3:
* tickets: load up comments and activity blended together
* improvements of events system

## Sergii Gamaiunov <hello@webkadabra.com> v0.4.2:
* update & fix nanoscroller on list views

## Sergii Gamaiunov <hello@webkadabra.com> v0.4.1:
+ comments for tickets

## Sergii Gamaiunov <hello@webkadabra.com> v0.4.0:
+ new activity stream event component logic & table structure
+ added ModelEntityBehavior to deal with entity records outside of CommentableBehavior

## Sergii Gamaiunov <hello@webkadabra.com> v0.3.1:
* improve users access validation on project/workspace level: user will only see project he owns, he has access to or
  that are in a space he owns (duh!)

## Sergii Gamaiunov <hello@webkadabra.com> v0.3.0:
+ invite users to projects

## Sergii Gamaiunov <hello@webkadabra.com> v0.2.2:
+ unified list view: app\www\app\js\views\common\superListView.js
* refactored tasks & message boards to use new superListView base view

## Sergii Gamaiunov <hello@webkadabra.com> v0.2.1:
* tag saving for message board topics
* auto-post first comments when creating a new topic (message boards)
* bug fixes

## Sergii Gamaiunov <hello@webkadabra.com> v0.2.0:
+ comments for project message board
+ new layout for project message board
* continued improvement of project message board module
* continued CSS/layout clean up
* display current app version & build name & time (bottom-left corner)

## Sergii Gamaiunov <hello@webkadabra.com> v0.1.1:
* bringing order to CSS/layout regarding lists with details panel

## Sergii Gamaiunov <hello@webkadabra.com> v0.1.0:
+ messages module