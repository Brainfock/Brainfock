/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */

var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    mui = require('material-ui'),
    Menu = mui.Menu,
    Loader = require('../../components/Loader');

//var Store = require('../../components/comments/Store');
//var Actions = require('../../components/comments/Actions');
var Item = require('./comments-list-item');

// for At.js plugin:
var $ = require('jquery');
//require('caret.js');
require('caret.js/dist/jquery.caret.min.js');
//require('jquery.atwho');
require('jquery.atwho/dist/js/jquery.atwho.js');

/**
 * TopicComments
 *
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
var TopicComments = React.createClass({

  getInitialState: function() {
    return {
      //Store:Store
    }
  },

  getDefaultProps: function() {
    return {
      topic:{},
      // some store cursor:
      model:null,
      //ThreadUsersStore:require('client/issues/ThreadUserStore')
    }
  },
  componentWillMount:function() {
    this.props.actions.loadEntityComments(this.props.topic.entityId);

    if(process.env.IS_BROWSER) {
      this.props.io.emit('sub-comments',{entity_id:this.props.topic.entityId});
      this.props.io.on('new-comment',function(data) {
        this.props.actions.catchComment(data.data);
      }.bind(this))
    }

      //this.props.io.emit('join',{'entity-comments':this.props.topic.entityId});

    //this.props.socket.on('onlineUsers', function(data, data2){
    //  console.log('online users changed');
    //  self.setState({online:data.onlineUsers})
    //});

  },

  //componentWillReceiveProps:function(nextProps, old) {
  //  if(this.props.model.id != nextProps.model.id) {
  //    Actions.issueActivity(this.props.model.id);
  //  }
  //},

  __componentDidMount:function()
  {
    // pull new comments
    //this.state.CursorStore.on('add remove reset change', function() {
    //this.props.model.on('change:id', function() {
    //  this.state.Store.isLoading=true;
    //  //Actions.entityActivity(this.props.model.get('entity_id'));
    //}, this);
    //
    //// redraw comments
    //this.state.Store.on('add remove reset change', function() {
    //  //Actions.issueActivity(this.props.model.id);
    //  this.forceUpdate();
    //}, this);
    //
    //// setup AtWho plugin when thread users store is changed
    //this.props.ThreadUsersStore.on('add reset', function() {
    //  this.setupCommentBox();
    //}, this);

    //Actions.listenToObjectActivity(this.props.topic.entityId);
  },
  __componentWillUnmount :function() {
    //this.state.Store.off(null, null, this);
    //this.props.ThreadUsersStore.off(null, null, this);
    //Actions.hangupObjectActivity(this.props.topic.entityId);
  },

  render: function()
  {
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
            <form className="comment-form commentsform" onSubmit={this.handleCommentSubmit}>
              <textarea onClick={this.setupCommentBox} name="comment" className="ux-comment-input ui-comment-input" required="required"
                        data-placeholder="Leave a comment" ref="commentbox" />
              <div className="actions" >
                <button className="btn ux-comments-submit-btn">Send</button>
              </div>
            </form>
          </div>
        </div>
    );
  },

  renderComments: function() {

    console.log('this.props.topic.comments:',this.props.comments);
    if(this.props.comments.length==0) {
      return (
          <div>
            <em><b>There are no comments here. Please, write one:</b></em>
          </div>
      );
    }

    return <div className="activity-stream" >

      {this.props.comments.map(result =>
          <div className="item" >
            <Item model={result} />
          </div>
      )}


    </div>;
  },
  __setupCommentBox: function()
  {
    var users=[];
    this.props.ThreadUsersStore.each(function(userModel){

      users.push({
        'id':userModel.get('id'),
        'name':userModel.get('name'),
        'userpic':userModel.get('userpic')
      });
    });
    // load all names in this project that this user has access to
    /*
     self.$('.ux-comment-input').atwho({
     at: "@",
     data: users,
     tpl: "<li data-value='@${name}'>${name} <img src='${userpic}'/></li>",
     show_the_at: true
     })
     */

    // TODO: extract all users in this conversation + add all users who user can mention 
    $(this.refs.commentbox.getDOMNode()).atwho({
      at: "@",
      data: users,
      tpl: "<li data-value='@${name}'>${name} <img src='${userpic}'/></li>",
      show_the_at: true
    })
  },

  /**
   * post entity comment
   */
  handleCommentSubmit: function(e)
  {
    e.preventDefault();
    var comment = $(this.refs.commentbox.getDOMNode()).val();
    this.props.actions.postComment(this.props.topic.entityId,{text:comment});
  },

});

module.exports = TopicComments;