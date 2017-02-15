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
import Component from 'react-addons-pure-render-mixin';

import MasterDetailsListView from './components/master-detail.list';
import ListViewItem from './components/issues-list-item';
import ProjectsEmpty from './components/projects-empty';
import IssueView from './components/Issue';

/**
 * @todo replace by topic_menu configuration; menu item config keeps settings for
 * template, empty list fallback, route etc.
 */
export default class ProjectIssues extends React.Component {
  static propTypes = {
    boards: React.PropTypes.object,
    children: React.PropTypes.object,
    location: React.PropTypes.object,
    msg: React.PropTypes.object,
  }
  resolveGroupKey() {
    return 'board_topic';
  }

  render() {
    const {board} = this.props.boards;
    const {children, ...passProps} = this.props;
    const {location: {pathname}} = this.props;
    return (
      <MasterDetailsListView
        containerTopic={board}
        detailsComponent={IssueView}
        emptyListFallback={ProjectsEmpty}
        groupKey={this.resolveGroupKey()}
        listViewItem={ListViewItem}
        pathname={pathname}
        {...passProps}
        />
    );
  }
};
