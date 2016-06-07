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
import {CardActions, FlatButton, CardText} from 'material-ui';
import Component from 'react-pure-render/component';

export default class FetchActionError extends Component {

  static propTypes = {
    action: React.PropTypes.func.isRequired,
    handleRetry: React.PropTypes.function,
    meta: React.PropTypes.object.isRequired,
    msg: React.PropTypes.object.isRequired,
  };

  constructor(props) {

    super(props);
    this.state = {};
  }

  render() {

    const {error} = this.props.meta;
    const msg = this.props.msg.error.service;

    let message = error;

    if (error === 'Failed to fetch') {
      // system error, that is occuring usually when server is down, on a reboot etc.
      message = msg.fetchFailed;
    }

    return (
      <div style={this.getWrapperStyle()}>
        <CardText>{message}</CardText>
        <CardActions style={{paddingTop:0}}>
          <FlatButton
            label="Retry"
            labelStyle={{color:'#B95252'}}
            onClick={this.props.handleRetry}
            style={{padding:100}}
            />
        </CardActions>
      </div>
    );
    //return (
    //  <div className="alert alert-warning" style={{margin:0, borderRadius:0}}>{message}
    //    <button onClick={this.props.handleRetry}>Retry</button>
    //  </div>
    //);
  }

  getWrapperStyle() {
    return {
    //  -webkit-box-shadow: inset 0px 7px 8px -4px rgba(92,92,92,0.52);
    //-moz-box-shadow: inset 0px 7px 8px -4px rgba(92,92,92,0.52);
      boxShadow: 'inset 0px 7px 8px -4px rgba(92,92,92,0.45)',
      background: '#efefef',
      color: 'maroon'
    };
  }
};
