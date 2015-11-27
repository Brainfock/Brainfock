/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';


import ProjectsEmpty from '../boards/components/boards.empty';
import MasterDetailsListView from '../projects/components/master-detail.list';
import ListView from '../projects/components/plain.list';
let PageWithNav = require('../components/layout/page-with-nav');
import TaskListItem from './components/task-list-item.js';

const views = {
  'master.detail': MasterDetailsListView,
  'list': ListView,
  'boards.homepage': ListView,
};

module.exports = React.createClass({

  componentWillMount() {
    if (process.env.IS_BROWSER === true) {
      //this.props.topic_actions.loadTopicGroup('board');
      //this.props.topic_actions.find('project', {}/*, this.props.parentModel*/);
    }
  },

  render: function()
  {
    let View;
    if (views[this.props.boards.group.view]) {
      View = views[this.props.boards.group.view];
    } else {
      View = MasterDetailsListView;
    }

    View = MasterDetailsListView;

    const {children, ...passProps} = this.props;
    return (
    <PageWithNav
      history={this.props.history}
      menuItems={this.menuItems()}>
      <View
        containerTopic={null}
        disableDetails_
        browseAll
        emptyListFallback={ProjectsEmpty}
        groupKey='issue'
        listViewItem={TaskListItem}
        groupBy={this.props.location.query && this.props.location.query.groupBy}
        {...passProps}
        />
    </PageWithNav>
    );
  },

  /**
   * @todo i18n
   * @returns {*[]}
   */
  menuItems() {
    let icon;
    if (this.props.boards.board.accessPrivateYn) {
      icon = (<i className="fa fa-eye-slash"></i>);
    }
    return [
      {
        route: `/tasks/`,
        text: 'All tasks',
      },
      {
        route: `/tasks/?filter[wfStatus][inq]=open&filter[wfStatus][inq]=progress`,
        text: 'Open & in Progress',
      },
      {
        route: `/tasks/?filter[isStarred]=1`,
        text: 'Starred',
      },
      {
        route: `/tasks/?filter[status]=draft`,
        text: 'Drafts',
      },
      {
        text: <div style={{
          fontSize:'11px',
          color: '#CECECE'
        }}><b>Please, notice</b>: menu is WIP</div>
      }
    ];
  }
});
