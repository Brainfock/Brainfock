/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (�Webkadabra�)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */

import React from 'react';
import Component from 'react-pure-render/component';

let PageWithNav = require('../components/layout/page-with-nav');
let Loader = require('../components/Loader');
let AppContentCanvas = require('../components/layout/AppContentCanvas');

class Layout extends Component{

  componentDidMount() {
    if(process.env.IS_BROWSER==true) {
      // load info about CURRENT BOARD
      this.props.topic_actions.loadCurrent(this.props.params.board_id, this.props.params.namespace);
      this.props.actions.workspaceFindById(this.props.params.namespace);
      // load TOPIC of this BOARD
     // this.props.topic_actions.find(this.props.groupKey || 'board_topic', {},this.props.params.board_id);
    }
  }

  render () {

    if (this.props.workspace.active.meta.isFetching || !this.props.boards.board || this.props.boards.board.loading == true) {
      return <AppContentCanvas header={
        <h1><Loader /></h1>
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
    return [
      {
        route: `/${this.props.workspace.active.data.namespace}/${this.props.boards.board.contextTopicKey}`,
        text: (
          <div
            /*onMouseOver={function(e){e.target.style.background}}*/
            style={{
            //background:"rgb(245, 245, 245)",
              margin:"0 -24px",
              padding:"10px 24px",
              fontSize:14,
              color:"#000",
              lineHeight:'16px',
            }}>
            {this.props.boards.board.summary}</div>
        )
      },
      {route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/issues`, text: 'Issues'},
      {
        route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/boards`,
        text: 'Discussion Boards'
      },
      // what about other menuss & modules?
      // Like agile or scrum boards, custom reports?
      {route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/users`, text: 'Users'},
      {route: `/${this.props.params.namespace}/${this.props.boards.board.contextTopicKey}/settings`, text: 'Settings'},
    ];
  }
};

export default Layout;
