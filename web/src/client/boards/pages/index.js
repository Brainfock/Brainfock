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

import List from './boards';
import ProjectsEmpty from '../boards.empty';

let ListComponent = require('../boards.react');

module.exports = React.createClass({
  /**
   * This component's user-friendly name for breadcrumbs
   * @param bcComponent
   * @returns {string}
   */
  displayName: function(bcComponent) {
    // todo: i18n
    return 'Boards';
  },

  componentWillMount() {
    if(process.env.IS_BROWSER==true) {
      this.props.topic_actions.loadTopicGroup('board', {}/*, this.props.parentModel*/);
      this.props.topic_actions.find('board', {}/*, this.props.parentModel*/);
    }
  },

  render: function()
  {
    const {boards:{list, board, group}, topic_actions, msg, history} = this.props;

    if(!group || !group.groupKey) {
      return <h4>Loading...2</h4>
    }

    if (!list.size) {
      const {children, ...passProps} = this.props;
      return (
        <ProjectsEmpty {...passProps} />
      );
    }

    return <List
      itemComponent={ListComponent}
      board={board}
      group={group}
      list={list}
      topic_actions={topic_actions}
      msg={msg}
      history={history}
      meta={this.props.boards.meta}
      />

  },
});
