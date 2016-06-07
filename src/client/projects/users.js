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

  componentWillMount() {

    //const {users: {viewer}, actions} = this.props;
    //
    //if (!this.props.users.getIn(['forms', 'id', -1, 'create'])) {
    //  actions.makeUserUpdateFormRecord(-1, 'create');
    //}
  }

  render()
  {
    return (
      <div className="wiki-wrapper">
        <div className="wiki-page">
          <div className="container-fluid">
            <div className="row">
              <h4>Invite new member to {this.props.boards.board.data.summary}:</h4>
              <div className="col-md-5 col-sm-4">
                <RemoteSelectField label='Username or email'
                  endpoint='/api/members'
                  formatCallback={(item) => {
                    return {
                      value:(item.id),
                      label:(item.username)
                    };}}
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


  handleSubmit = () => {
    this.props.actions.submitTopicMember({open: true});
  };
};
