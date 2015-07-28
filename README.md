# Brainfock
#### Topic management solution / CMF
Copyright (C) 2013-2015 Sergii Gamaiunov, hello@webkadabra.com

Brainfock is a modern web-based CMF started out as task & project management tool and ended up as something that angels might have crafted. It  will help you manage projects, project's tasks, deals, contacts, run community (discussion borads), manage documents like Wiki & much more. 

**RELEASE DATE**: August-September, 2015, follow Brainfock on [GitHub](https://github.com/Brainfock/Brainfock), [Twitter](https://twitter.com/brainfockapp) or [Facebook](https://www.facebook.com/Brainfock) for updates.

### Features
- Robust React.js-powered Web-client
- Basic setup requires only **PHP** & **database server** (like MySql)
- WebSockets (optional)
- Workspaces, Projects, Planning & Milestones, Tickets
- Discussion boards (per project or any other object)
- Wiki module - each object can have it's own Wiki; Special pages, Pages Index etc.
- Customizable data scheme (projects, boards, issues are available out-of-the-box, everything is configurable) 
- Customizable issue types
- Access control per container (e.g. project, discussion board) and items (e.g. issue, board topic)
- Customizable workflows per container & issue group/type
- User notificaitons
- Activity stream per object (project, issue etc.)
- I18n & L10n

![](http://i57.tinypic.com/5cjfkh.png)

Code:
- frontend is done fully on React.js
- Yii Framework at backend
- requires PHP5.3+, MySql 5+; 
- requires command line access for advanced setup
- for advanced features, ZMQ is required


### Version
v0.16.0 - currently in develoment. Public code release is planned on August-September 2015 with version v1.0 Please, stay tuned for updates.

### Tech summary
Brainfock uses a number of open source projects to work properly:

* React.js/FLUX for client
* Google Material Design (utilizing powerful <http://material-ui.com>) 
* Node.js' NPM, Webpack & Bower
* [Marked] - a super fast port of Markdown to JavaScript
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* jQuery, Underscore, Lodash, Backbone.js, [Cortex.js](https://github.com/mquan/cortex)

### Installation
```
Please, see SETUP.md for details
```

### Contibution & support
Want to contribute? Great! I'll be very happy to get help. More info is coming closer to public code release.

### Contacts
Developer - Sergii Gamaiunov <hello@webkadabra.com>

### Todo
- Web installer
- Private messages
- Uploads module
- Plugin system (backend) & modules system for web-client
- Mobile App
- Node.js for backend (optional)
- Tests coverage
- Server-side rendering
- VCS integration for software development 
- Admin interface
- More predefined data schemes (Sales management etc.)

License
---

(Currently being worked on, but you can be sure it'll be GPL)

** Authors **

[sergii gamaiunov]:http://webkadabra.com/
