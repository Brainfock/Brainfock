export default {
  app: {
    footer: {
      madeByHtml: `made by <a href="https://twitter.com/webkadabra">Webkadabra</a>`
    },
    header: {
      user: {
        welcome: `Logged in as`,
        accountButton: {
          label: `My account`
        },
        signinButton: {
          label: `Sign in`
        }
      },
      h1: `Home`,
      login: 'Login',
      me: 'Me (protected)',
      todos: 'Todos'
    }
  },
  auth: {
    form: {
      button: {
        login: 'Login',
        signup: 'Sign up'
      },
      hint: 'Hint: pass1',
      legend: 'Login / Sign Up',
      placeholder: {
        email: 'your@email.com',
        password: 'password'
      },
      wrongPassword: 'Wrong password.'
    },
    logout: {
      button: 'Logout'
    },
    index: {
      title: 'Login'
    },
    validation: {
      email: `Email address is not valid.`,
      password: `Password must contain at least {minLength} characters.`,
      required: `Please fill out {prop, select,
        email {email}
        password {password}
        other {'{prop}'}
      }.`
    }
  },
  home: {
    infoHtml: `<a href="https://github.com/Brainfock/Brainfock">Brainfock</a> — Business Management & Team Collaboration
    software.`,
    title: 'Brainfock App',
    toCheck: {
      andMuchMore: '... and much more.',
      header: 'Things to Check',
      isomorphicPage: 'Isomorphic page',
      // This is example how we can localize ordered lists.
      itemListHtml: [
        {
          key: 'source',
          txt: `Server rendering.`
        },
        {
          key: 'development',
          txt: `Hot reloadable styles, components, actions, stores, messages.`
        },
        {
          key: 'production',
          txt: `App performance and size in production mode (<code>npm web-start</code>)`
        }
      ]
    }
  },
  me: {
    title: 'Me',
    welcome: `Hi {email}. This is your secret page.`
  },
  notFound: {
    continueMessage: 'Continue here please.',
    header: 'This page isn\'t available',
    message: 'The link may be broken, or the page may have been removed.',
    title: 'Page Not Found'
  },
  todos: {
    add100: 'Add 100 Todos',
    clearAll: 'Clear All',
    emptyList: 'Nothing. Go outside and enjoy world.',
    newTodoPlaceholder: 'What needs to be done?',
    title: 'Todos'
  },
  topics: {
    list:{
      addNew: {
        button: 'Add New',
      },
      countItems: `{countItems, plural,
  =0 {No items in list}
  one {# item}
  other {# items}
}`
    },
    form: {
      create: {
        title: 'Create New {type}',
      },
      button: {
        create: 'Create',
        cancel: 'Cancel',
        save: 'Save',
      },
      label: {
        accessPrivate: 'Available to invited users only',
        summary: 'Summary (name)',
        text: 'Project description',
        logoIcon: 'Project icon',
        logoBackground: 'Project background color',
      },
      hint: {
        summary: 'Try to keep it short',
        text: 'Markdown markup supported',
        logoIcon: 'Font Awesome icon name',
        logoBackground: 'Logo Background',
      },
      section: {
        main: 'Settings',
        general: 'Project details',
        access: 'Access settings',
        danger: 'Danger zone',
      },
      deleteItem: {
         button: 'Delete this project',
      }
      //summary: {
      //  label: 'Available to invited users only',
      //  hint: 'Summary (name)',
      //},
      //accessPrivate: {
      //  label: 'Available to invited users only',
      //  hint: 'Summary (name)',
      //},
    }
  },

  users: {
    list:{
      addNew: {
        button: 'Add New',
      },
      countItems: `{countItems, plural,
  =0 {No items in list}
  one {# item}
  other {# items}
}`,
      column: {
        label: {
          name: 'Name',
          email: 'Email',
          role: 'Access permission',
        },
        hint: {
          id: 'Unique user ID',
          role: 'Access permission',
        }
      }
    },
    form: {
      create: {
        title: 'Create New {type}',
      },
      button: {
        create: 'Create',
        cancel: 'Cancel',
        save: 'Save',
      },
      label: {
        accessPrivate: 'Available to invited users only',
        summary: 'Summary (name)',
        text: 'Project description',
        logoIcon: 'Project icon',
        logoBackground: 'Project background color',
      },
      hint: {
        summary: 'Try to keep it short',
        text: 'Markdown markup supported',
        logoIcon: 'Font Awesome icon name',
        logoBackground: 'Logo Background',
      },
      section: {
        main: 'Settings',
        general: 'Project details',
        access: 'Access settings',
        danger: 'Danger zone',
      },
      deleteItem: {
         button: 'Delete this project',
      }
      //summary: {
      //  label: 'Available to invited users only',
      //  hint: 'Summary (name)',
      //},
      //accessPrivate: {
      //  label: 'Available to invited users only',
      //  hint: 'Summary (name)',
      //},
    }
  },

  groupSchemes: {
    list:{
      addNew: {
        button: 'Add New',
      },
      countItems: `{countItems, plural,
  =0 {No items in list}
  one {# item}
  other {# items}
}`,
      column: {
        label: {
          name: 'Name',
          email: 'Email',
          groups: 'Available Groups',
          isDefault: 'System-wide default',
        },
        hint: {
          id: 'Unique user ID',
        }
      }
    },
    form: {
      create: {
        title: 'Create New {type}',
      },
      button: {
        create: 'Create',
        cancel: 'Cancel',
        save: 'Save',
      },
      label: {
        accessPrivate: 'Available to invited users only',
        summary: 'Summary (name)',
        text: 'Project description',
        logoIcon: 'Project icon',
        logoBackground: 'Project background color',
      },
      hint: {
        summary: 'Try to keep it short',
        text: 'Markdown markup supported',
        logoIcon: 'Font Awesome icon name',
        logoBackground: 'Logo Background',
      },
      section: {
        main: 'Settings',
        general: 'Project details',
        access: 'Access settings',
        danger: 'Danger zone',
      },
      deleteItem: {
         button: 'Delete this project',
      }
      //summary: {
      //  label: 'Available to invited users only',
      //  hint: 'Summary (name)',
      //},
      //accessPrivate: {
      //  label: 'Available to invited users only',
      //  hint: 'Summary (name)',
      //},
    }
  },
  error: {
    service: {
      fetchFailed: 'Could not load data, please, try again'
    }
  }
};
