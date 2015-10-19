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
var React = require('react');
var mui = require('material-ui');
var bs = require('react-bootstrap'),
  {Nav, NavItem, ButtonToolbar, ButtonGroup, Button, Glyphicon, TabbedArea, TabPane, DropdownButton, MenuItem} = bs;

var Loader = require('../components/Loader');
var AppContentCanvas = require('../components/layout/AppContentCanvas');

/**
 * TopicView
 *
 * @todo define propTypes
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
var TopicView = React.createClass({

  /**
   * This component's user-friendly name for breadcrumbs
   * @param bcComponent
   * @returns {string}
   */
  displayName: function(bcComponent) {
    return bcComponent.props.model.attributes.summary
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  /**
   * prealod board info
   */
  componentDidMount: function()
  {
    if(process.env.IS_BROWSER==true) {
      if(this.props.params.id)
      {
        this.props.topic_actions.loadNamespaceGroupTopicByNum(this.props.params.namespace, this.props.params.group_key, this.props.params.id);
      }
    }
  },

  componentWillReceiveProps: function(newProps)
  {
    if(newProps.params.namespace && newProps.params.group_key && newProps.params.id && (this.props.params !== newProps.params))
    {
      this.props.topic_actions.loadNamespaceGroupTopicByNum(this.props.params.namespace, this.props.params.group_key, this.props.params.id);
    }
  },

  /**
   *
   * @returns {XML}
   */
  comments: function() {
    if(this.props.boards.viewTopic.type && this.props.boards.viewTopic.type.commentsEnabled) {
      var Comments  = require('../topic/components/comments');
      return  <Comments
        topic={this.props.boards.viewTopic}
        comments={this.props.boards.viewTopic.comments}
        io={this.props.io}
        actions={this.props.actions} />
    }
  },

  /**
   * @returns {XML}
   */
  render: function()
  {
    if(this.props.boards.viewTopic.loading==true)
    {
      return <AppContentCanvas header={
        <h4 className="pull-left"><Loader /></h4>
      }/>
    }

    const viewTopic = this.props.boards.viewTopic;
    let operaitons = [];
    let i = 0;
    if(viewTopic.operations) {
      viewTopic.operations.forEach(function(op){
        i++;
        var _style={};
        var active=false;
        if(viewTopic.workflowStageId==op.id) {
          _style['font-weight']=800;
          active=true;
        }
        operaitons.push(<MenuItem onClick={self.applyOperation} data-operation-id={op.id} eventKey={i} active={active}>{op.name}</MenuItem>);
      })
    }

    return (
      <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
        <DropdownButton className="pull-right" eventKey={3} title="">
          {operaitons}
        </DropdownButton>
        {this.props.boards.viewTopic && <h2 style={{fontWeight:800}}>{this.props.boards.viewTopic.summary} <span className="label label-primary ">{this.props.boards.viewTopic.wfStage}</span></h2>}

        <mui.Card>
          <mui.CardHeader
            title={viewTopic.author && <b>{viewTopic.author.username}</b>}
            subtitle= {viewTopic.createdOn}
            avatar={viewTopic.author.username && <mui.Avatar>{viewTopic.author.username.charAt(0)}</mui.Avatar>}/>

          {this.props.boards.viewTopic.text
          && <mui.CardText>{this.props.boards.viewTopic.text}</mui.CardText>}
        </mui.Card>
        <div style={{paddingTop:this.context.muiTheme.rawTheme.spacing.desktopGutter}} className="">
          {this.comments()}
        </div>
      </div>
    );
  }

});

module.exports = TopicView;