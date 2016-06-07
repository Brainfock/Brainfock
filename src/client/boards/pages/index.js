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

import List from './boards';
import ProjectsEmpty from '../boards.empty';
import ListComponent from '../boards.react';
import Loader from '../../components/Loader';

module.exports = React.createClass({
  /**
   * This component's user-friendly name for breadcrumbs
   * @param bcComponent
   * @returns {string}
   */
  displayName: function(bcComponent) {
    // todo: i18n
    return 'Boards';
  },

  componentWillMount() {
    if(process.env.IS_BROWSER == true) {
      this.props.topicActions.loadTopicGroup('board', {}/*, this.props.parentModel*/);
      this.props.topicActions.find('board', {}/*, this.props.parentModel*/);
    }
  },

  render: function()
  {
    const {boards:{list, board, group, meta}, topicActions, msg, history} = this.props;

    if (!group || !group.groupKey || meta.loading === true) {
      return <h1><Loader /></h1>;
    }

    if (!list.size) {
      const {children, ...passProps} = this.props;
      return (
        <ProjectsEmpty {...passProps} />
      );
    }

    return (
      <List
        itemComponent={ListComponent}
        board={board}
        group={group}
        list={list}
        topicActions={topicActions}
        msg={msg}
        history={history}
        meta={this.props.boards.meta}
        params={this.props.params}
        />
    );

  },
});
