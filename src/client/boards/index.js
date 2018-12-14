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

import ProjectsEmpty from './components/boards.empty';
import MasterDetailsListView from '../projects/components/master-detail.list';
import ListView from '../projects/components/plain.list';

const views = {
  'master.detail': MasterDetailsListView,
  'list': ListView,
  'boards.homepage': ListView,
};

module.exports = React.createClass({

  componentWillMount() {
    this.props.actions.appSetActiveSectionLabel('Discussion Boards');
    if (process.env.IS_BROWSER === true) {
      this.props.topic_actions.loadTopicGroup('board');
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
      <View
        containerTopic={null}
        disableDetails
        emptyListFallback={ProjectsEmpty}
        groupKey='board'
        groupBy={this.props.location.query && this.props.location.query.groupBy}
        {...passProps}
        />
    );
  }
});
