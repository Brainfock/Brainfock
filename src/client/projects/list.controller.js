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

export default class ProjectIssues extends Component {

  /**
   * resolve group (key) to load topics for, taking into account plurals form of gorup name,
   * e.g. `brainfock/issues` will resolve group key `issue`
   * @returns {*}
   */
  resolveGroupKey() {
    if (this.props.params.groupKey.substr(-1) === 's') {
      return this.props.params.groupKey.substr(0, this.props.params.groupKey.length-1)
    } else {
      return this.props.params.groupKey;
    }
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
