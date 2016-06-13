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
import Loader from '../components/Loader.js';
import {List, ListItem} from 'material-ui';

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
    this.props.topicActions.findTopicMembers(this.props.boards.board.data.id);
  }

  render() {
    const membersList = this.renderList();
    return (
      <div>
          <h3 style={{paddingLeft:15}}>{this.props.boards.board.data.summary} team</h3>
          <div className="container-fluid">
            <div className="row">
              {membersList}
            </div>
          </div>
        <div className="container-fluid">
          <div className="row">
            <h4 style={{paddingLeft:15}}>Invite new member to {this.props.boards.board.data.summary}</h4>
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

    );
  }

  renderList() {
    if (!this.props.boards.getIn(['members', this.props.boards.board.data.id])) {
      return <Loader />;
    }
    const {list, listMeta} = this.props.boards.getIn(['members', this.props.boards.board.data.id]);
    if (listMeta.isFetching === true || !list) {
      return <Loader />;
    } else {
      return (<List>
        {list.map(member =>
            <ListItem>
              {member.user.username} / {member.user.email}
            </ListItem>
        )}
      </List>);
    }
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
