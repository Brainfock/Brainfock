/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Component from 'react-pure-render/component';

let PageWithNav = require('../components/layout/page-with-nav');
let Loader = require('../components/Loader');
let AppContentCanvas = require('../components/layout/AppContentCanvas');

class Layout extends Component {

  updateAppSectionLabels(props) {
    this.props.actions.appSetActiveSectionLabel(props.workspace.active.data.name,  props.boards.board.data.summary);
  }
  componentDidMount() {
    if (process.env.IS_BROWSER === true) {
      this.updateAppSectionLabels(this.props);

      // load info about CURRENT BOARD
      this.props.topic_actions.loadCurrent(this.props.params.board_id, this.props.params.namespace);
      this.props.topic_actions.fetchTopicMenu(this.props.params.board_id, this.props.params.namespace);
      this.props.actions.workspaceFindById(this.props.params.namespace);
      // load TOPIC of this BOARD
     // this.props.topic_actions.find(this.props.groupKey || 'board_topic', {},this.props.params.board_id);
    }
  }

  componentWillReceiveProps(newProps) {
    if(this.props.workspace.active.data.name !== newProps.workspace.active.data.name) {
      this.updateAppSectionLabels(newProps);
    }
  }

  componentWillUpdate(newProps) {
    if(this.props.workspace.active.data.name !== newProps.workspace.active.data.name) {
      this.updateAppSectionLabels(newProps);
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
    if (this.props.boards.board.data.accessPrivateYn) {
      icon = (<i className="fa fa-eye-slash"></i>);
    }

    const homeUrl = `/${this.props.workspace.active.data.namespace}/${this.props.boards.board.data.contextTopicKey}`;
    let menu = [
      {
        route: homeUrl,
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
            {this.props.boards.board.data.summary} {icon}</div>
        )
      },
    ];
    //if(this.props.boards.board.menu.size && this.props.boards.board.menu.size > 0) {
      this.props.boards.board.menu.forEach(item => {
        menu.push({
          route: (item.link.charAt(0) !== '/' ? homeUrl + '/' + item.link : item.link),
          text: item.label,
        })
      })
   // }

    menu.push({route: `/${this.props.params.namespace}/${this.props.boards.board.data.contextTopicKey}/users`, text: 'Users'})
    menu.push({route: `/${this.props.params.namespace}/${this.props.boards.board.data.contextTopicKey}/settings`, text: 'Settings'})

    return menu;
    return [
      {
        route: `/${this.props.workspace.active.data.namespace}/${this.props.boards.board.data.contextTopicKey}`,
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
            {this.props.boards.board.data.summary} {icon}</div>
        )
      },
      {
        route: `/${this.props.params.namespace}/${this.props.boards.board.data.contextTopicKey}/issues`, text: 'Issues',
        routes: [
          `/${this.props.params.namespace}/${this.props.params.board_id}/issue/${this.props.params.id}`,
        ]
      },
      {
        route: `/${this.props.params.namespace}/${this.props.boards.board.data.contextTopicKey}/boards`,
        text: 'Discussion Boards',
        routes: [
          `/${this.props.params.namespace}/${this.props.params.board_id}/board/${this.props.params.id}`,
          `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.params.groupKey}/${this.props.params.id}/browse`
        ]
      },
      {
        route: `/${this.props.params.namespace}/${this.props.boards.board.data.contextTopicKey}/discussions`,
        text: 'Discussions',
        routes: [
          `/${this.props.params.namespace}/${this.props.params.board_id}/board/${this.props.params.id}`,
          `/${this.props.params.namespace}/${this.props.params.board_id}/${this.props.params.groupKey}/${this.props.params.id}/browse`
        ]
      },
      // what about other menuss & modules?
      // Like agile or scrum boards, custom reports?
      {route: `/${this.props.params.namespace}/${this.props.boards.board.data.contextTopicKey}/users`, text: 'Users'},
      {route: `/${this.props.params.namespace}/${this.props.boards.board.data.contextTopicKey}/settings`, text: 'Settings'},
    ];
  }
};

export default Layout;
