/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';
import Component from 'react-pure-render/component';

import ProjectsEmpty from './components/projects-empty';
import ListViewItem from './components/project-list-item';
import MasterDetailsListView from './components/master-detail.list';

export default class ProjectsIndex extends Component {

  render() {
    const {children, ...passProps} = this.props;
    return (
      <MasterDetailsListView
        containerTopic={null}
        disableDetails
        emptyListFallback={ProjectsEmpty}
        _listViewItem={ListViewItem}
        groupKey='project'
        {...passProps}
        />
    );
  }
}
