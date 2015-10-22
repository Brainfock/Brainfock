/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (�Webkadabra�)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';
import {FormattedMessage} from 'react-intl';

import List from '../boards/pages/boards';
import ListComponent from '../boards/boards.react';
import ProjectsEmpty from './components/projects-empty';
import Loader from '../components/Loader';
import ListActions from '../components/UIListActions';

import Form from '../topic/components/create-topic-form';

module.exports = React.createClass({
  /**
   * This component's user-friendly name for breadcrumbs
   * @param bcComponent
   * @returns {string}
   */
  displayName: function(bcComponent) {
    // todo: i18n
    return 'Projects';
  },

  componentWillMount() {
    if(process.env.IS_BROWSER==true) {
      this.props.topic_actions.loadTopicGroup('project', {}/*, this.props.parentModel*/);
      this.props.topic_actions.find('project', {}/*, this.props.parentModel*/);
    }
  },

  render: function()
  {
    const {boards:{list, board, group, meta, formFields, newTopic }, topic_actions, msg, history} = this.props;

    if (!group || !group.groupKey || meta.loading === true) {
      return <h1><Loader /></h1>;
    }

    const addItemForm = (
      <Form
        actions={this.props.topic_actions}
        containerStore={null}
        formFields={formFields}
        newTopic={newTopic}
        params={this.props.params}
        ref="formView"
        topicGroup="project"
        />
    );

    if (!list.size) {
      const {children, ...passProps} = this.props;
      return (
        <ProjectsEmpty {...passProps} form={addItemForm} />
      );
    }

    const summary = meta.count > 0
      ? <FormattedMessage
      defaultMessage={msg.topics.list.countItems}
      values={{countItems:meta.count}}
      />
      : '';

    const titleMsg = (
      <h3 style={{
        margin: 0,
        padding: '24px 24px 0px',
        color: 'rgba(0, 0, 0, 0.870588)',
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: 400
      }}>
        <FormattedMessage
          defaultMessage={msg.topics.form.create.title}
          id={'msg.topics.form.create.title'}
          values={{type:this.props.boards.group.name}}
          />
      </h3>
    );

    const ListActionsRendered = (
      <div className="pull-right">
        {summary}

        <ListActions
          addItemForm={addItemForm}
          BUTTON_ACTION_LABEL={msg.topics.list.addNew.button}
          formFields={formFields}
          msg={msg.topics}
          TITLE={titleMsg}
          />
      </div>
    );
    return (
      <div>{ListActionsRendered}
      <List
        itemComponent={ListComponent}
        board={board}
        group={group}
        list={list}
        topic_actions={topic_actions}
        msg={msg}
        history={history}
        meta={this.props.boards.meta}
        params={this.props.params}
        />
        </div>
    );

  },
});