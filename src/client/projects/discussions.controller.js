/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
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

  resolveGroupKey() {
    return 'board_topic';
  }

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
        {...passProps}
        />
    );
  }
};
