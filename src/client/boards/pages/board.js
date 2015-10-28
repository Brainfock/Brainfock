import React from 'react';
import {Link} from 'react-router';

import ProjectsEmpty from '../components/boards.empty';
import MasterDetailsListView from '../../projects/components/master-detail.list';
import ListView from '../../projects/components/plain.list';

const views = {
  'master.detail': MasterDetailsListView,
  'list': ListView,
  'boards.homepage': ListView,
};

module.exports = React.createClass({

  //componentDidMount() {
  //  // pull all topics (projects) from server - this list is filtered by client
  //  if(process.env.IS_BROWSER==true) {
  //    // load info about current group
  //    this.props.topic_actions.loadTopicGroup(this.props.groupKey || 'board', {}/*, this.props.parentModel*/);
  //    // load info about CURRENT BOARD
  //    this.props.topic_actions.loadCurrent(this.props.params.board_id);
  //    // load TOPICS of this BOARD
  //    this.props.topic_actions.find(this.props.groupKey || 'board_topic', {},this.props.params.board_id);
  //  }
  //}


  componentWillMount() {
    if (process.env.IS_BROWSER === true) {
      // load info about CURRENT BOARD
      this.props.topic_actions.loadCurrent(this.props.params.board_id);
      this.props.topic_actions.loadTopicGroup('board');
      //this.props.topic_actions.find('project', {}/*, this.props.parentModel*/);
    }
  },

  render: function () {

    let View;
    if (views[this.props.boards.group.view]) {
      View = views[this.props.boards.group.view];
    } else {
      View = MasterDetailsListView;
    }

    const {children, groupKey, ...passProps} = this.props;
    return (
      <div>
        <h4><Link to='/boards'>{this.props.boards.group.summary}</Link> > {this.props.boards.board.summary}</h4>
        <MasterDetailsListView
          {...passProps}
          containerTopic={this.props.boards.board}
          disableDetails
          emptyListFallback={ProjectsEmpty}
          groupKey='board_topic'
          />
      </div>
    );
  }
});
