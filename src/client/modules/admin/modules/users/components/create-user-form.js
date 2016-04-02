/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import Component from 'react-pure-render/component';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

import Loader from '../../../../../components/Loader';

class CreateUserForm extends Component {

  componentWillMount() {

    const {users: {viewer}, actions} = this.props;

    if (!this.props.users.getIn(['forms', 'id', -1, 'create'])) {
      actions.makeUserUpdateFormRecord(-1, 'create');
    }
  }



  render() {

    const msg = this.props.msg.users;
    const formData = this.props.users.getIn(['forms', 'id', -1, 'create']);

    return <div>
      <TextField
      name="username"
      autocomplete='off'
      onChange={(e)=>{
                    this.props.actions.setUserCreateFormField(e, -1, 'create')
                    }.bind(this)}

      errorText={formData.meta.errors && formData.meta.errors.get('username') || ''}
      value={formData.data.get('username')}
      floatingLabelText={msg.form.label.username}
      />

      <br />

      <TextField
      name="email"
      autocomplete='off'
      onChange={(e)=>{
                    this.props.actions.setUserCreateFormField(e, -1, 'create')
                    }.bind(this)}

      errorText={formData.meta.errors && formData.meta.errors.get('email') || ''}
      value={formData.data.get('email')}
      floatingLabelText={msg.form.label.email}
      />

      <br />

      <TextField
        type='password'
        autocomplete='off'
        name="password"
        onChange={(e)=>{
                      this.props.actions.setUserCreateFormField(e, -1, 'create')
                      }.bind(this)}

        errorText={formData.meta.errors && formData.meta.errors.get('password') || ''}
        value={formData.data.get('password')}
        floatingLabelText={msg.form.label.password}
      />
    </div>
  }

  onChange(e) {
    this.props.actions.setUserCreateFormField(e/*, {id: this.props.topic.data.id}*/);
  }

};

export default CreateUserForm;