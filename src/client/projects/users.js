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

import RemoteSelectField from '../components/form/RemoteSelectField.js';
import {RaisedButton} from 'material-ui';

export default class Dashboard extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object,
    boards: React.PropTypes.object,
    topicActions: React.PropTypes.object,
  }

  componentWillMount() {
    if (!this.props.boards.getIn(['forms', 'member-invite', this.props.boards.board.data.id])) {
      this.props.topicActions.setupTopicMemberInviteForm(this.props.boards.board.data.id);
    }
  }

  render() {
    return (
      <div className="wiki-wrapper">
        <div className="wiki-page">
          <div className="container-fluid">
            <div className="row">
              <h4>Invite new member to {this.props.boards.board.data.summary}:</h4>
              <div className="col-md-5 col-sm-4">
                <RemoteSelectField
                  endpoint='/api/members'
                  formatCallback={(item) => {
                    return {
                      // for react-select:
                      value:(item.id),
                      label:(item.username),
                      // for redux stuff:
                      id:(item.id),
                      email:(item.email)
                    };}}
                  label='Username or email'
                  onChange = {::this.inputChanged}
                  value=''
                  />
              </div>
              <div className="col-md-5 col-sm-4">
                <RaisedButton label='Invite user' onTouchTap={this.handleSubmit} />
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  inputChanged(userId, userData) {
    if (userData.length) {
      userData = userData[0];
    }
    ['id', 'email'].forEach((i, ii) => this.props.topicActions.setTopicMemberInviteFormField({
      target: {
        name: i,
        value: userData[i]
      }},
      this.props.boards.board.data.id
    ));

  }
  handleSubmit = () => {
    const formData = this.props.boards.getIn(['forms', 'member-invite', this.props.boards.board.data.id, 'data']);
    this.props.topicActions.submitTopicMemberInviteForm(this.props.boards.board.data.id, formData);
  };
};
