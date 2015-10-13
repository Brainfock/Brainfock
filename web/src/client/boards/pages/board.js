var React = require('react');

var Router = require('react-router'),
    { Navigation, RouteHandler, Link } = Router,
    mui = require('material-ui-io');


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

let Topic = require('./topic');
/**
 * Project Issues
 */
var Issues = React.createClass({

  componentDidMount: function() {
    // pull all topics (projects) from server - this list is filtered by client
    if(process.env.IS_BROWSER==true) {
      // load info about current group
      this.props.topic_actions.loadTopicGroup('board', {}/*, this.props.parentModel*/);
      // load info about CURRENT BOARD
      this.props.topic_actions.loadCurrent(this.props.params.board_id);
      // load TOPICS of this BOARD
      this.props.topic_actions.find(this.props.groupKey || 'board_topic', {},this.props.params.board_id);
    }
  },

  propTypes : {
    children: React.PropTypes.any,
    boards: React.PropTypes.isRequired,
  },


  /**
   * @returns {XML}
   */
  render: function()
  {
    const {boards:{group}} = this.props;

    //return <AppContentCanvas header={
      //  <h4 className="pull-left"><Loader />...</h4>
      //}/>
    //

    //let TopicActions = require('client/boards/_topic/Actions'),
    //    TopicStore = require('client/boards/_topic/Store'),
    //    TopicCursorStore = require('client/boards/_topic/CursorStore'),
    //    TopicFormStore = require('client/boards/_topic/FormStore'),
    //    Form = require('client/boards/_topic/components/BoardTopicForm');
    //
    //var ListActionsRendered = <div>
    //  <ListActions
    //      FormComponent={Form}
    //      FormStore={TopicFormStore}
    //      /* who's team do we want to see */
    //      containerStore={this.props.topic}
    //      Actions={TopicActions}
    //      TITLE='issues_createForm_TITLE'
    //      BUTTON_ACTION_LABEL='issues_createForm_actionButtonLabel'
    //      />
    //  <br />
    //</div>
    //
    //let ListComponent = require('client/project/_issues/components/List.jsx');
    //
    //let ListItemComponent = require('client/boards/_topic/components/ListItem.jsx');

    //
    //let header = <div>
    //  <h4 style={{margin:'7px 0px 4px 0'}} className="pull-left">
    //    {this.props.topic.get('summary')}
    //  </h4>
    //  <div className="pull-right" style={{'text-align':'left'}}>
    //    {ListActionsRendered}
    //  </div>
    //
    //</div>;


    const board_title = this.props.boards.board
      ? (
          this.props.boards.board.loading === true
            ? <h3>Loading...</h3>
            : <h4><Link to={`/boards`}>{group.name}</Link> > {this.props.boards.board.summary}</h4>
        )
      : <h1>Loading...</h1>;

    return  <AppContentCanvas>
      <div className="col-lg-8 col-lg-offset-2 col-md-9 col-md-offset-1 clearfix">
        {board_title}
      </div>
      {this.content()}
    </AppContentCanvas>
  },

  content:function() {

    let ListView = require('../boards.react');
    let ListViewItem = require('../board.topic.js');

    // forward to issue view:
    // todo: move into reusable component, and this component will only send props for param key to watch for forwarding
    if(this.props.params.id){

      const {children, ...passProps} = this.props;
      return (
        <div className="col-lg-8 col-lg-offset-2 col-md-9 col-md-offset-1">
          {React.cloneElement(children, passProps)}
        </div>
      )
      //return <Topic {...this.props} />
      //return <div>{React.cloneElement(this.props.children, this.props)}</div>
    }
    else {
      return (
        <div className="col-lg-8 col-lg-offset-2 col-md-9 col-md-offset-1">
        <ListView
          list={this.props.boards.list}
          actions={this.props.topic_actions}
          msg={this.props.msg.todos}
          history={this.props.history}
          itemComponent={ListViewItem}
          params={this.props.params}

          /* who's team do we want to see
          containerStore={this.props.topic}
          /!* message if list is empty /
          EmptyComponent={EmptyComponent} */
          />
        </div>
      )
    }
  }


});

module.exports = Issues;