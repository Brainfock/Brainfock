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

var React = require('react');
var Router = require('react-router'),
    { RouteHandler } = Router;

let List = require('./boards');


//let Store = require('../ProjectModel');

module.exports = React.createClass({
  /**
   * This component user-friendly name for breadcrumbs
   * @param bcComponent
   * @returns {string}
   */
  displayName: function(bcComponent) {
    // todo: i18n
    return 'Boards'
  },

  render: function()
  {
    console.log('[__PROPS__]:',this.props)
    //let props = {...this.props};
  //  props.board_id = this.props.params.board_id;

    // forward to board or topic view
    if(this.props.params.board_id)
      return <div>{React.cloneElement(this.props.children, this.props)}</div>;
    // show all boards
    else {
      const {boards:{list}, topic_actions, msg, history} = this.props;
      return <List
              topicType='board'
              list={list}
              topic_actions={topic_actions}
              msg={msg}
              history={history}
              meta={this.props.boards.meta}
        />
    }

  },
});
