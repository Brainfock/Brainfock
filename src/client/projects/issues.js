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

import MasterDetailsListView from './components/master-detail.list';
import ListViewItem from './components/issues-list-item';
import ProjectsEmpty from './components/projects-empty';
import IssueView from './components/Issue';

export default class ProjectIssues extends Component {

  render() {
    const {board, meta, listFilters, newTopic, formFields} = this.props.boards;
    const msg = this.props.msg.topics;
    const {children, ...passProps} = this.props;
    return (
      <MasterDetailsListView
        containerTopic={board}
        detailsComponent={IssueView}
        emptyListFallback={ProjectsEmpty}
        groupKey='issue'
        listViewItem={ListViewItem}
        {...passProps}
        />
    );
  }
};
