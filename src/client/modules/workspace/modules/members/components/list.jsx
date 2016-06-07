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

class ViewUser extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object,
    children: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
  }

  /**
   * @todo implement
   */
  render() {

    const {children, ...props} = this.props;

    if (children) {
      return React.cloneElement(children, props);
    }

    return (
      <div>
        <h4>@todo: list all users here</h4>
      </div>
    );
  }

}

export default ViewUser;
