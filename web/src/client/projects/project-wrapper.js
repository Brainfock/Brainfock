/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
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

let PageWithNav = require('../components/layout/page-with-nav');
let Loader = require('../components/Loader');
let AppContentCanvas = require('../components/layout/AppContentCanvas');

var Layout = React.createClass({

  componentDidMount: function() {
    if(process.env.IS_BROWSER==true) {
      // load info about CURRENT BOARD
      this.props.topic_actions.loadCurrent(this.props.params.board_id);
      // load TOPIC of this BOARD
      this.props.topic_actions.find(this.props.groupKey || 'board_topic', {},this.props.params.board_id);
    }
  },

  render: function () {

    if(!this.props.boards.board || this.props.boards.board.loading == true) {
      return <AppContentCanvas header={
        <h1><Loader /></h1>
      }/>
    }

    return (
      <div>
        <h1>{this.props.boards.board.summary}</h1>
        <PageWithNav  menuItems={this.menuItems()} {...this.props} />
      </div>
    );
  },

  /**
   * @todo i18n
   * @returns {*[]}
   */
  menuItems:function() {
    return [
      { route: `/project/${this.props.boards.board.id}`, text: 'Dashboard'},
      { route: `/project/${this.props.boards.board.id}/issues`, text: 'Issues'},
      { route: `/project/${this.props.boards.board.id}/users`, text: 'Users'}
    ];
  }
});

export default Layout;
