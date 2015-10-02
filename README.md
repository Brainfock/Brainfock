[![Brainfock](https://brainfock.files.wordpress.com/2014/11/logo_greenhex_trans.png?w=250)](http://brainfock.org)

#### Topic management solution / CMF

[![Join the chat at https://gitter.im/Brainfock/Brainfock](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Brainfock/Brainfock?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Copyright (C) 2013-2015 Sergii Gamaiunov, <hello@webkadabra.com>

> Brainfock is a modern web-based CMF started out as task & project management tool and ended up as something that angels might have crafted. It  will help you manage projects, project's tasks, deals, contacts, run community (discussion borads), manage documents like Wiki & much more.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Follow Brainfock on [GitHub](https://github.com/Brainfock/Brainfock), [Twitter](https://twitter.com/brainfockapp) or [Facebook](https://www.facebook.com/Brainfock) for updates.

### Features

- Robust React.js-powered Web-client
- Server-side rendering of React components
- WebSockets
- Projects, Planning & Milestones, Tickets
- Discussion boards (per project or any other object)
- Wiki module - each object can have it's own Wiki; Special pages, Pages Index etc.
- Customizable data scheme (projects, boards, issues are available out-of-the-box, everything is configurable)
- Customizable issue types
- Access control per container (e.g. project, discussion board) and items (e.g. issue, board topic)
- User notificaitons
- Activity stream per object (project, issue etc.)
- I18n & L10n

![](http://i57.tinypic.com/5cjfkh.png)

Code:
- frontend is done fully on React.js
- Node.js / Loopback (Express) in the back


### Status

Currently in develoment (porting PHP/Backbone code to Node/React). Public code release is planned with version v1.0
Please, stay tuned for updates!

### Tech summary

Brainfock uses a number of Open Source libraries to work properly. We used great [Este.js](https://github.com/este/este) stack
coupled with [Loopback](http://loopback.io/) to deal with web backend, models etc. For more tech info, please, see README-TECH

* React.js
* Google's Material Design guildelines (utilizing powerful <http://material-ui.com>)
* Node.js' NPM, Webpack & Bower
* [Marked] - a super fast port of Markdown to JavaScript

Developers, please, follow [README-DEVS.md](/README-DEVS.md) for in-depth information about Este stack, setup and development

### Installation

```
Please, see README-DEVS.md for details
```

### Contibution & support
Want to contribute? Great! I'll be very happy to get help. More info is coming closer to public code release.

### Contacts
Developer - Sergii Gamaiunov <hello@webkadabra.com>

### Todo
- Customizable workflows per container & issue group/type
- Workspaces
- Web installer
- Private messages
- Uploads module
- Plugin system (backend) & modules system for web-client
- Mobile native apps for Android & iOS
- Tests coverage
- VCS integration for software development
- Admin interface
- More predefined data schemes (Sales management etc.)

License
---

AGPL v3

## Notes

- Works on OSX, Linux, and Windows. Feel free to report any issue.
- As a rule of thumb, Brainfock supports all evergreen browsers plus last two pieces of IE.
- You can support Brainfock development with donations

## Credit

Sergii Gamaiunov, [twitter.com/Webkadabra](https://twitter.com/Webkadabra)

** Authors **

[sergii gamaiunov]:http://webkadabra.com/
