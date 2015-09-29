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
import Loader from '../components/Loader';

export default class ProjectIssues extends React.Component{

  componentDidMount() {
    // pull all topics (projects) from server - this list is filtered by client
    if(process.env.IS_BROWSER==true) {
      // load TOPICS of this BOARD
      this.props.topic_actions.find('issue', {},this.props.params.board_id);
    }
  }

  render()
  {
    console.log("__PROPS__>",this.props)
    const {boards:{board}} = this.props;
    //if(!this.props.topic)
    //{
    //  return <div className="row">
    //    <div style={{marginTop:'5%'}} className="col-md-4 col-md-offset-4">
    //      <h1><Loader />...</h1>
    //    </div>
    //  </div>
    //}

    let ListView = require('../boards/boards.react');
    let ListViewItem = require('../boards/board.topic.js');

    return <ListView

      list={this.props.boards.list}
      actions={this.props.topic_actions}
      msg={this.props.msg.todos}
      history={this.props.history}
      itemComponent={ListViewItem}
      params={this.props.params}

      /* who's team do we want to see
      containerStore={this.props.topic}
      /!* message if list is empty /
      EmptyComponent={EmptyComponent}

      ListComponent={ListComponent}
      ListItemComponent={ListItemComponent}

      Actions={TopicActions}
      Store={TopicStore}
      CursorStore={TopicCursorStore}*/
      />

    return (
      <div className="wiki-wrapper">
        <div className="wiki-page">
          <div className="container-fluid">
            <div className="row">
              ISSUES
            </div>
          </div>
        </div>

      </div>
    );
  }
};
