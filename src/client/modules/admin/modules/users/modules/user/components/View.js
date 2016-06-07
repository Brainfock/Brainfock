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
    params: React.PropTypes.object,
  }

  render() {
    return (
      <div>
        <h4>VIEW USER {this.props.params.userId || 'undefined'}</h4>
      </div>
    );
  }

}

export default ViewUser;
