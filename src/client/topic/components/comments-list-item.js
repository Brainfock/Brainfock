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
import {Avatar} from 'material-ui';
import Loader from '../../components/Loader';

class CommentItem extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object,
    children: React.PropTypes.object,
    model: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
  }

  deleteComment() {
    this.props.model.destroy();
  }

  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  render() {
    if (!this.props.model.id === 0) {
      return <Loader />;
    }
    return this.renderComment();
    //return this.renderComment();
    //if (this.props.model.type=='comment'*/) {
    //  return this.renderComment();
    //} else {
    //  return this.renderEvent();
    //}
  }

  renderComment() {
    if (!this.props.model.user) {
      return <div><em>n/a</em></div>;
    }
    return (
      <div className="row">
      <div className="pull-left" style={{width: '70px'}}>
        <div className="pull-right">
          <Avatar>{this.props.model.user.username && this.props.model.user.username.charAt(0)}</Avatar>
        </div>
      </div>

      <div className="bubble">
        <div className="comment-meta">
          <b>{this.props.model.user.username}</b>
          <abbr className="timeago" title={this.props.model.created_on}>{this.props.model.createdOn}</abbr>
        </div>
        <div dangerouslySetInnerHTML={{__html: this.props.model.contentRendered}} />
      </div>
    </div>
    );
  }

  renderEvent() {
    if (!this.props.model.user) {
      return <div>n/a</div>;
    }
    return (<div className="activity-event row">
      <div className="event-inner">
        <img className="userpic" src={this.props.model.user.userpic} />
        <abbr className="timeago" title={this.props.model.created_on}>{this.props.model.created_on} </abbr>
        <div dangerouslySetInnerHTML={{__html: this.props.model.contentRendered}} />
      </div>
    </div>);
  }
}

export default CommentItem;
