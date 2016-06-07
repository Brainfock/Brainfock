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

import ProjectsEmpty from './components/empty-list-fallback.js';
import MasterDetailsListView from '../projects/components/master-detail.list';
import ListView from '../projects/components/plain.list';
let PageWithNav = require('../components/layout/page-with-nav');
import TaskListItem from './components/task-list-item.js';

const views = {
  'master.detail': MasterDetailsListView,
  'list': ListView,
  'boards.homepage': ListView,
};

export default class OpportunitiesIndex extends Component {
  static propTypes = {
    actions: React.PropTypes.object,
    boards: React.PropTypes.object,
    children: React.PropTypes.object,
    history: React.PropTypes.object,
    location: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
  }

  componentWillMount() {
    this.props.actions.appSetActiveSectionLabel('Opportunities');
    if (process.env.IS_BROWSER === true) {
      //this.props.topicActions.loadTopicGroup('board');
      //this.props.topicActions.find('project', {}/*, this.props.parentModel*/);
    }
  }

  render() {
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
          browseAll
          containerTopic={null}
          disableDetails_
          emptyListFallback={ProjectsEmpty}
          groupBy={this.props.location.query && this.props.location.query.groupBy}
          groupKey='opportunity'
          listViewItem={TaskListItem}
          {...passProps}
          />
      </PageWithNav>
    );
  }

  /**
   * @todo i18n
   * @returns {*[]}
   */
  menuItems() {
    return [
      {
        route: '/tasks/',
        text: 'All tasks',
      },
      {
        route: '/tasks/?filter[wfStatus][inq]=open&filter[wfStatus][inq]=progress',
        text: 'Open & in Progress',
      },
      {
        route: '/tasks/?filter[isStarred]=1',
        text: 'Starred',
      },
      {
        route: '/tasks/?filter[status]=draft',
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
}