import React from 'react';
import {Link} from 'react-router';
import {IconButton} from 'material-ui';

import ProjectsEmpty from '../components/boards.empty';
import MasterDetailsListView from '../../projects/components/master-detail.list';
import ListView from '../../projects/components/plain.list';

const views = {
  'master.detail': MasterDetailsListView,
  'list': ListView,
  'boards.homepage': ListView,
};

/**
 * Board view
 *
 * List topics of a board (same as issues of a project)
 */
module.exports = React.createClass({

  getDefaultProps(){
    return {
      groupKey: 'board'
    }
  },

  componentWillMount() {

    if (process.env.IS_BROWSER === true) {

      // load info about CURRENT BOARD
      this.props.topic_actions.loadCurrent(this.props.params.board_id);

      if (!this.props.boards.groups.has(this.props.groupKey))
        this.props.topic_actions.loadTopicGroup('board');
    }
  },

  render: function () {

    const {children, groupKey, ...passProps} = this.props;
    const group = this.props.boards.groups.get(groupKey);

    let View;
    if (views[this.props.boards.group.view]) {
      View = views[this.props.boards.group.view];
    } else {
      View = MasterDetailsListView;
    }

    return (
      <div>
        <div className="breadcrumbs-bar clearfix" style={{
          background: '#8982A2', // variants: 8C8D98, 7F8090, 7E848E, DAD9E6, FDFDFD
          padding: '5px 15px',
          margin: 0,
          color: '#fff'
        }}>
          <div className="pull-right">
            <IconButton iconClassName="fa fa-pencil" tooltip="Settings" iconStyle={{color: '#EFEFEF'}}
              onClick={()=>{this.props.history.pushState(null,`/board/edit/${this.props.boards.board.id}`)}}/>
          </div>
          {group &&
          <h4><Link to='/boards'
                    style={{color: '#EFEFEF',textDecoration:'underline'}}>{group.summary}</Link>
            > {this.props.boards.board.summary}</h4>}
        </div>



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
