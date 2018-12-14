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
import {Avatar} from 'material-ui';

class UserAvatar extends Component {

  static propTypes = {
    user: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <Avatar>{this.props.user.username && this.props.user.username.charAt(0)}</Avatar>
    )
  }
}

export default UserAvatar
