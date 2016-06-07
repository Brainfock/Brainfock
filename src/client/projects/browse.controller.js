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

/**
 * @todo replace by topic_menu configuration; menu item config keeps settings for
 * template, empty list fallback, route etc.
 */
export default class ProjectIssues extends Component {

  componentDidMount() {
    // fetch data initially in scenario 2 from above
    this.fetchBoardInfo();
  }

  fetchBoardInfo() {

    if (process.env.IS_BROWSER !== true) {
      return;
    }

    const groupKey = this.resolveGroupKey();

    // http://localhost:3000/api/workspaces/sandbox/topics/demosand/topics/board/3
    this.props.topic_actions.loadTopicGroupBoard(groupKey, this.props.browseBoardNum);


    if (this.props.browseBoardNum) {
      // load group scheme - so to know what are we about to list (what group)
      // get list of available columns (TODO)
      //
      // loadTopicSubBoard()
      // load()
    } else {

      this.props.topic_actions.count(groupKey, this.state.filters, this.props.params.board_id, this.props.params.namespace);
      this.props.topic_actions.find(groupKey, this.state.filters, this.props.params.board_id, this.props.params.namespace);
      this.props.topic_actions.loadFilters(groupKey, {}, this.props.params.board_id);
    }

    if (!this.props.boards.group || this.props.boards.group.groupKey !== groupKey) {
      this.props.topic_actions.loadTopicGroup(groupKey);
    }

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

  // load info about what group is available in :sub_board_num
  render() {
    const {board, meta, listFilters, newTopic, formFields} = this.props.boards;
    const msg = this.props.msg.topics;
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
        browseBoardNum={this.props.params.sub_board_num}
        groupBy={this.props.location.query.groupBy}
        {...passProps}
        />
    );
  }
};
