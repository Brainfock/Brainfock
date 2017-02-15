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
import Component from 'react-addons-pure-render-mixin';
import TextField from 'material-ui/lib/text-field';

class CreateUserForm extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object,
    children: React.PropTypes.object,
    msg: React.PropTypes.object,
    users: React.PropTypes.object,
  }

  componentWillMount() {
    const {actions} = this.props;

    if (!this.props.users.getIn(['forms', 'id', -1, 'create'])) {
      actions.makeUserUpdateFormRecord(-1, 'create');
    }
  }

  render() {

    const msg = this.props.msg.users;
    const formData = this.props.users.getIn(['forms', 'id', -1, 'create']);

    return (
      <div>
        <TextField

        autocomplete='off'
        errorText={formData.meta.errors && formData.meta.errors.get('username') || ''}
        floatingLabelText={msg.form.label.username}
        name="username"
        onChange={(e)=>{
          this.props.actions.setUserCreateFormField(e, -1, 'create');
        }.bind(this)}
        value={formData.data.get('username')}
        />

        <br />

        <TextField

        autocomplete='off'
        errorText={formData.meta.errors && formData.meta.errors.get('email') || ''}
        floatingLabelText={msg.form.label.email}
        name="email"
        onChange={(e)=>{
          this.props.actions.setUserCreateFormField(e, -1, 'create');
        }.bind(this)}
        value={formData.data.get('email')}
        />

        <br />

        <TextField

          autocomplete='off'
          errorText={formData.meta.errors && formData.meta.errors.get('password') || ''}
          floatingLabelText={msg.form.label.password}
          name="password"
          onChange={(e)=>{
            this.props.actions.setUserCreateFormField(e, -1, 'create');
          }.bind(this)}
          type='password'
          value={formData.data.get('password')}
        />
      </div>
    );
  }

  onChange(e) {
    this.props.actions.setUserCreateFormField(e/*, {id: this.props.topic.data.id}*/);
  }

}

export default CreateUserForm;
