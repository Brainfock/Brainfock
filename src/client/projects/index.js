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

import ProjectsEmpty from './components/projects-empty';
import ListViewItem from './components/project-list-item';
import MasterDetailsListView from './components/master-detail.list';

export default class ProjectsIndex extends Component {

  componentWillMount() {
    this.props.actions.appSetActiveSectionLabel('Projects');
  }
  render() {
    const {children, ...passProps} = this.props;
    return (
      <MasterDetailsListView
        containerTopic={null}
        disableDetails
        emptyListFallback={ProjectsEmpty}
        listViewItem={ListViewItem}
        groupKey='project'
        groupBy={this.props.location.query && this.props.location.query.groupBy}
        {...passProps}
        />
    );
  }
}
