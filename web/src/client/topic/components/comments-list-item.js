var React = require('react'),
    Router = require('react-router'),
    Loader = require('../../components/Loader'),
    Link = Router.Link,
    Navigation = Router.Navigation,

    mui = require('material-ui');

var bs = require('react-bootstrap'),
    {ButtonToolbar, ButtonGroup, Button, Glyphicon} = bs;

module.exports = React.createClass({
  mixins: [Navigation, Router.State],
  delete: function() {
    this.props.model.destroy();
  },
  getInitialState: function() {
    return {
      active: false,
    }
  },

  render: function() {

    if(!this.props.model.id === 0) {
      return <Loader />
    }
    return this.renderComment();
    if(1==1 /*OR this.props.model.type=='comment'*/) {
      return this.renderComment();
    } else {
      return this.renderEvent();
    }
  },

  renderComment: function() {

    if(!this.props.model.user) {
      return <div><em>n/a</em></div>
    }
    return <div className="row">
      <div className="pull-left" style={{width: '70px'}}>
        <div className="pull-right">

          <img src={this.props.model.user.userpic} />



        </div>

      </div>

      <div className="bubble">
        <div className="comment-meta">
          <b>{this.props.model.user.username}</b>

          <abbr title={this.props.model.created_on} className="timeago">{this.props.model.createdOn}</abbr>
        </div>
        <div dangerouslySetInnerHTML={{__html: this.props.model.contentRendered}} />
      </div>



    </div>




  },

  renderEvent: function() {
    if(!this.props.model.user) {
      return <div>n/a</div>
    }
    return <div className="activity-event row">
      <div className="event-inner">

        <img className="userpic" src={this.props.model.user.userpic} />

        <abbr title={this.props.model.created_on} className="timeago">{this.props.model.created_on} </abbr>

        <div dangerouslySetInnerHTML={{__html: this.props.model.contentRendered}} />



      </div>
    </div>

  },
});
