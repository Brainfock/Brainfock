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
import Loader from '../components/Loader';
import AppContentCanvas from '../components/layout/AppContentCanvas';
import Issue from './components/Issue.js';

/**
 * TopicView
 *
 * @todo define propTypes
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
let TopicView = React.createClass({
  propTypes: {
    actions: React.PropTypes.object,
    boards: React.PropTypes.object,
    io: React.PropTypes.object,
    params: React.PropTypes.object,
    topicActions: React.PropTypes.object,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  /**
   * prealod board info
   */
  componentDidMount: function() {
    if (process.env.IS_BROWSER === true) {
      if (this.props.params.id) {
        this.props.topicActions.loadNamespaceTopicByNum(this.props.params.namespace, this.props.params.board_id, this.props.params.group_key, this.props.params.id);
      }
    }
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.params.namespace && newProps.params.group_key && newProps.params.id && (this.props.params !== newProps.params)) {
      this.props.topicActions.loadNamespaceTopicByNum(this.props.params.namespace, this.props.params.board_id, this.props.params.group_key, this.props.params.id);
    }
  },

  /**
   * @returns {XML}
   */
  render: function() {
    const viewTopic = this.props.boards.viewTopic;
    if (viewTopic.loading === true &&
        // replace whole page by loader only if we're switching between topics, or else we get unnecessary redraw of comments etc.
      (!viewTopic.id || parseInt(viewTopic.contextTopicNum, 10) !== parseInt(this.props.params.id, 10))) {

      return (
        <AppContentCanvas header={
          <h4 className="pull-left"><Loader /></h4>
        }/>
      );
    }

    let style = {
      opacity: this.props.boards.viewTopic.loading === true ? .3 : 1,
      position: 'relative'
    };

    return (
      <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1" style={style}>
        <Issue
          actions={this.props.actions}
          io={this.props.io}
          topic={this.props.boards.viewTopic}
          topicActions={this.props.topicActions}
          />
      </div>
    );
  },
});

module.exports = TopicView; // eslint-disable-line no-undef
