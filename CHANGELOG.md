Changelog
=========

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

## Changelog for older version of Brainfock, before `PHP -> Node.js` migration.

> Please note: Many of backend features available in versions under 0.15.* (PHP/Yii backend) may not be available in newer version of Brainfock app.
> These entries are left here for history & todo reference. Some of features in version under 0.16 must be ported to new app.

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

## 25 Sep 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.10.0:
+ notification system
+ notification i18n
+ notification delivery system

## 7 Sep 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.9.3:
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

## 5 Sep 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.9.1:
* fix EntityWatchBehavior (when deleting "Watch" relation)
* adjust Task model - user_watch attribute rules

## 4 Sep 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.9.0:
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
* improve tickets form (add visual ר³דפה maxlength counter)
* improve dock form l10n
* do not render details panel on model sync - it interrupts inline editing flow
* css/ui cleanup & custom TODC bootstrap adjustment
* space dashboard/project deletion l10n (ru, uk)
* confirm dialog fix

## 25 Aug 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.7.7:
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

## 19 Aug 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.7.1:
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

## 18 Aug 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.7.0:
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

## 1 Aug 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.5.0:
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

## 31 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.4.1:
+ comments for tickets

## 30 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.4.0:
+ new activity stream event component logic & table structure
+ added ModelEntityBehavior to deal with entity records outside of CommentableBehavior

## 29 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.3.1:
* improve users access validation on project/workspace level: user will only see project he owns, he has access to or
  that are in a space he owns (duh!)

## 29 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.3.0:
+ invite users to projects

## 29 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.2.2:
+ unified list view: app\www\app\js\views\common\superListView.js
* refactored tasks & message boards to use new superListView base view

## Sergii Gamaiunov <hello@webkadabra.com> v0.2.1:
* tag saving for message board topics
* auto-post first comments when creating a new topic (message boards)
* bug fixes

## 28 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.2.0:
+ comments for project message board
+ new layout for project message board
* continued improvement of project message board module
* continued CSS/layout clean up
* display current app version & build name & time (bottom-left corner)

## 27 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.1.1:
* bringing order to CSS/layout regarding lists with details panel

## 26 Jul 2014; Sergii Gamaiunov <hello@webkadabra.com> v0.1.0:
+ messages module