/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react'

class ViewUser extends React.Component {

  render() {
    return (
      <div>
        <h4>VIEW USER {this.props.params.userId || "undefined"}</h4>
      </div>
    )
  }

}

export default ViewUser