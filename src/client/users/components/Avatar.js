/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
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
