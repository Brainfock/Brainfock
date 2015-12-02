/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';
import Component from 'react-pure-render/component';

let PageWithNav = require('../components/layout/page-with-nav');
let Loader = require('../components/Loader');
let AppContentCanvas = require('../components/layout/AppContentCanvas');

class Layout extends Component {

  componentDidMount() {
    if (process.env.IS_BROWSER === true) {
      // load info about CURRENT BOARD
      this.props.topic_actions.loadCurrent(this.props.params.board_id, this.props.params.namespace);
      this.props.topic_actions.fetchTopicMenu(this.props.params.board_id, this.props.params.namespace);
      this.props.actions.workspaceFindById(this.props.params.namespace);
      // load TOPIC of this BOARD
     // this.props.topic_actions.find(this.props.groupKey || 'board_topic', {},this.props.params.board_id);
    }
  }

  render () {

    // return full-page loader only if there's really no data
    if (this.props.workspace.active.meta.isFetching || !this.props.boards.board || this.props.boards.board.loading == true) {
      return <AppContentCanvas header={
        <h1>
          <Loader />
        </h1>
      }/>
    }

    return (
      <div>
        <PageWithNav  menuItems={this.menuItems()} {...this.props} />
      </div>
    );
  }

  /**
   * @todo i18n
   * @returns {*[]}
   */
  menuItems() {

    let icon;
    if (this.props.boards.board.accessPrivateYn) {
      icon = (<i className="fa fa-eye-slash"></i>);
    }
    console.log(">>menu", this.props.boards.board.menu)

    let menu = [
      {
        route: `/${this.props.workspace.active.data.namespace}/${this.props.boards.board.contextTopicKey}`,
        text: (
          <div
            style={{
            //background:"rgb(245, 245, 245)",
              margin:'0 -24px',
              padding:'10px 24px',
              fontSize:14,
              color:'#000',
              lineHeight:'16px'
            }}>
            {this.props.boards.board.summary} {icon}</div>
        )
      },
    ];
    //if(this.props.boards.board.menu.size && this.props.boards.board.menu.size > 0) {
      this.props.boards.board.menu.forEach(item => {
        menu.push({
          route: item.link,
          text: item.label,
        })
      })
   // }

    menu.push({route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/users`, text: 'Users'})
    menu.push({route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/settings`, text: 'Settings'})

    return menu;
    return [
      {
        route: `/${this.props.workspace.active.data.namespace}/${this.props.boards.board.contextTopicKey}`,
        text: (
          <div
            style={{
            //background:"rgb(245, 245, 245)",
              margin:'0 -24px',
              padding:'10px 24px',
              fontSize:14,
              color:'#000',
              lineHeight:'16px'
            }}>
            {this.props.boards.board.summary} {icon}</div>
        )
      },
      {
        route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/issues`, text: 'Issues',
        routes: [
          `/${this.props.params.namespace}/${this.props.params.board_id}/issue/${this.props.params.id}`,
        ]
      },
      {
        route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/boards`,
        text: 'Discussion Boards',
        routes: [
          `/${this.props.params.namespace}/${this.props.params.board_id}/board/${this.props.params.id}`,
          `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.params.groupKey}/${this.props.params.id}/browse`
        ]
      },
      {
        route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/discussions`,
        text: 'Discussions',
        routes: [
          `/${this.props.params.namespace}/${this.props.params.board_id}/board/${this.props.params.id}`,
          `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.params.groupKey}/${this.props.params.id}/browse`
        ]
      },
      // what about other menuss & modules?
      // Like agile or scrum boards, custom reports?
      {route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/users`, text: 'Users'},
      {route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/settings`, text: 'Settings'},
    ];
  }
};

export default Layout;
