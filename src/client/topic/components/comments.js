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
const Item = require('./comments-list-item');

// for At.js plugin:
//var $ = require('jquery');
////require('caret.js');
//require('caret.js/dist/jquery.caret.min.js');
////require('jquery.atwho');
//require('jquery.atwho/dist/js/jquery.atwho.js');

/**
 * TopicComments
 *
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
class TopicComments extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object,
    children: React.PropTypes.object,
    comments: React.PropTypes.array,
    io: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
    topic: React.PropTypes.object,
  }

  static defaultProps = {
    topic:{},
    // some store cursor:
    model:null,
  };

  componentWillMount() {
    this.props.actions.loadEntityComments(this.props.topic.entityId);
    if (process.env.IS_BROWSER) {
      this.props.io.emit('sub-comments', {entity_id:this.props.topic.entityId}); // eslint-disable-line camelcase
    }
    //this.props.io.emit('join',{'entity-comments':this.props.topic.entityId});
    //this.props.socket.on('onlineUsers', function(data, data2){
    //  console.log('online users changed');
    //  self.setState({online:data.onlineUsers})
    //});
  }

  //componentWillReceiveProps:function(nextProps, old) {
  //  if(this.props.model.id != nextProps.model.id) {
  //    Actions.issueActivity(this.props.model.id);
  //  }
  //},

  render() {
    //if(this.state.Store.isLoading == true) {
    //  // this action call is a workaround of an issue: whner ticket is updated, activity list is clieared
    //  //Actions.entityActivity(this.props.model.get('entity_id'));
    //  return (
    //      <div>
    //        <Loader />...
    //      </div>
    //  );
    //}

    return (
      <div className="container-fluid">
        <div className="comments-wrapper" >
          {this.renderComments()}
        </div>

        <div className="comment-form-wrapper" >
          <form className="comment-form commentsform" onSubmit={this.handleCommentSubmit.bind(this)}>
                <textarea
                  className="ux-comment-input ui-comment-input"
                  data-placeholder="Leave a comment"
                  name="comment"
                  onClick={this.setupCommentBox}
                  ref="commentbox"
                  required="required" />
            <div className="actions" >
              <button className="btn ux-comments-submit-btn">Send</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  renderComments() {
    if (this.props.comments.length === 0) {
      return (
        <div>
          <em><b>There are no comments here. Please, write one:</b></em>
        </div>
      );
    }

    return (<div className="activity-stream" >
      {this.props.comments.map(result =>
          <div className="item" >
            <Item model={result} />
          </div>
      )}
    </div>);
  }

  /*__setupCommentBox()
  {
    var users = [];
    this.props.ThreadUsersStore.each(function(userModel) {

      users.push({
        'id':userModel.get('id'),
        'name':userModel.get('name'),
        'userpic':userModel.get('userpic')
      });
    });
    // load all names in this project that this user has access to
    /!*
     self.$('.ux-comment-input').atwho({
     at: "@",
     data: users,
     tpl: "<li data-value='@${name}'>${name} <img src='${userpic}'/></li>",
     show_the_at: true
     })
     *!/

    // TODO: extract all users in this conversation + add all users who user can mention
    $(this.refs.commentbox).atwho({
      at: '@',
      data: users,
      tpl: "<li data-value='@${name}'>${name} <img src='${userpic}'/></li>",
      show_the_at: true
    });
  }*/

  /**
   * post entity comment
   */
  handleCommentSubmit(e) {
    e.preventDefault();
    let comment = this.refs.commentbox.value;
    this.props.actions.postComment(this.props.topic.entityId, {text:comment});
  }
}


export default TopicComments;

