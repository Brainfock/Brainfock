var React = require('react');
var Router = require('react-router'),
  { Navigation, RouteHandler } = Router,
  mui = require('material-ui-io');
var bs = require('react-bootstrap'),
  {Nav, NavItem, ButtonToolbar, ButtonGroup, Button, Glyphicon,  TabbedArea, TabPane, DropdownButton, MenuItem} = bs;

var Loader = require('../../components/Loader');
var AppContentCanvas = require('../../components/layout/AppContentCanvas');

var ListActions =  require('../../components/UIListActions');

var EmptyComponent =  React.createClass({
  render: function() {
    return <div className="alert alert-info">
      <p>TopicItems_ListEmpty</p>
    </div>
  }
});


/**
 * Project Issues
 */
var Issues = React.createClass({

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


  //getInitialState: function() {
  //  return {
  //    model: false,
  //  };
  //},
  //
  //getDefaultProps: function() {
  //  return {
  //    ddtopic: null,
  //  };
  //},

  /**
   * prealod board info
   */
  componentDidMount: function()
  {

    if(this.props.params.id)
    {
      if(process.env.IS_BROWSER==true) {
        this.props.topic_actions.loadTopic(this.props.params.id);
        //this.props.actions.topic.query('board_topic', {}, this.props.board_id);
      }

      ////Actions.findByPk(this.getParams().board_id);
      //var model;
      //model = this.props.topic.set({id: this.getParams().board_id});
      //
      //$.when(model.fetch())
      //    .done(function() {
      //      this.setState({model: model})
      //    }.bind(this))
    }
    else {
      this.transitionTo('/?ERR=board_id-3');
    }
  },
  /**
   *
   * @returns {XML}
   */
  comments: function() {
    if(this.props.boards.viewTopic.type && this.props.boards.viewTopic.type.commentsEnabled) {
      var Comments  = require('../../topic/components/comments');
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
    //if(process.env.IS_BROWSER) {
    //  window.__PROPS = this.props;
    //}
    //console.log('!!!this.props.boards.lists:',this.props.boards.lists)
    //console.log('!!!this.props.boards.lists:',this.props.boards.lists[this.props.board_id])
    //if(!this.props.boards.lists[this.props.board_id]) {
    //  return <h1>Empty!</h1>;
    //
    //}
    if(this.props.boards.viewTopic.loading==true)
    {
      return <AppContentCanvas header={
        <h4 className="pull-left"><Loader /></h4>
      }/>
    }

    //let ListComponent = require('../boards.react');
    /*<ListComponent2
     list={this.props.boards.topics}
     msg={this.props.msg.boards}
     actions={this.props.actions.topic}
     />*/

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
      <div>
        <mui.Card>
          <DropdownButton className="_pull-right" eventKey={3} title="">
            {operaitons}
          </DropdownButton>
          {this.props.boards.viewTopic && <mui.CardTitle title={this.props.boards.viewTopic.summary}/>}


          <mui.CardText>
            {this.props.boards.viewTopic.text}
          </mui.CardText>

        </mui.Card>
        <div style={{paddingTop:this.context.muiTheme.spacing.desktopGutter}} className="">
          {this.comments()}
        </div>
      </div>
    );
/*
    let TopicActions = require('client/boards/_topic/Actions'),
      TopicStore = require('client/boards/_topic/Store'),
      TopicCursorStore = require('client/boards/_topic/CursorStore'),
      TopicFormStore = require('client/boards/_topic/FormStore'),
      Form = require('client/boards/_topic/components/BoardTopicForm');

    var ListActionsRendered = <div>
      <ListActions
        FormComponent={Form}
        FormStore={TopicFormStore}
        /!* who's team do we want to see *!/
        containerStore={this.props.topic}
        Actions={TopicActions}
        TITLE={l20n.ctx.getSync('issues_createForm_TITLE')}
        BUTTON_ACTION_LABEL={<Entity entity='issues_createForm_actionButtonLabel' />}
        />
      <br />
    </div>

    let ListComponent = require('client/project/_issues/components/List.jsx');

    let ListItemComponent = require('client/boards/_topic/components/ListItem.jsx');
    let TopicUsersView = require('client/components/topic/TopicUsers');

    let header = <div>
      <h4 style={{margin:'7px 0px 4px 0'}} className="pull-left">
        {this.props.topic.get('summary')}
      </h4>
      <div className="pull-right" style={{'text-align':'left'}}>
        {ListActionsRendered}
      </div>

    </div>;


    return  <AppContentCanvas header={header}>
      <TopicUsersView
        /!* who's team do we want to see *!/
        containerStore={this.props.topic}
        /!* message if list is empty *!/
        EmptyComponent={EmptyComponent}

        ListComponent={ListComponent}
        ListItemComponent={ListItemComponent}

        Actions={TopicActions}
        Store={TopicStore}
        CursorStore={TopicCursorStore}
        /></AppContentCanvas>*/
  },

});

module.exports = Issues;