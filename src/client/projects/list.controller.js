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

export default class ProjectIssues extends React.Component {
  static propTypes = {
    boards: React.PropTypes.object,
    children: React.PropTypes.object,
    location: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
  }
  /**
   * resolve group (key) to load topics for, taking into account plurals form of gorup name,
   * e.g. `brainfock/issues` will resolve group key `issue`
   * @returns {*}
   */
  resolveGroupKey() {
    if (this.props.params.groupKey.substr(-1) === 's') {
      return this.props.params.groupKey.substr(0, this.props.params.groupKey.length - 1);
    } else {
      return this.props.params.groupKey;
    }
  }

  render() {
    const {board} = this.props.boards;
    const {children, ...passProps} = this.props;
    const {location: {pathname}} = this.props;
    return (
      <MasterDetailsListView
        containerTopic={board.data || /* @deprecated since `board.data` */ board }
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
