import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Router from 'react-router';

var AppContentCanvas = require('../../components/layout/AppContentCanvas');
var ListActions =  require('../../components/UIListActions');

var EmptyComponent =  React.createClass({
  render: function() {
    return <div className="alert alert-info">
      <p><Entity entity="Projects_ListEmpty" /></p>
    </div>
  }
});

let ListComponent = require('../boards.react');

/**
 * List all topics of group 'project' - all data is loaded from server, client-side filtering: gather all needed files
 * (actions, stores) and setup List/Form/Filter components
 *
 * Features:
 *  - FLUX search
 *
 * There is no container topic for this list
 *
 * @todo make reusable, should have container?
 * @todo actually, 'container' model of this list is model of form, right?
 *
 * @todo: pull from server (by group key [projects]: routeName, formSettings, listSettings, ListColumns
 */

export default class Boards extends Component {

  static propTypes = {
    topicType: PropTypes.string.isRequired,
    //topicType: PropTypes.object.isRequired,
    //viewer: PropTypes.object
  }

  /**
   * initialize data
   */
  componentWillMount() {
    // pull all topics (projects) from server - this list is filtered by client
    //console.log(this.props.actions)
    if(process.env.IS_BROWSER==true) {
      this.props.topic_actions.find(this.props.topicType, {}/*, this.props.parentModel*/);
    }
  }

  render() {
    const {msg, viewer} = this.props;

    // TODO: header title must be provided from group settings, localized
    let header = <div>
      <h4>Boards</h4>
    </div>;

    if(this.props.meta.loading==true) {
      return <h3>Loading...</h3>
    }

    return (
      <AppContentCanvas header={header}>
        <div className="col-md-7 col-md-offset-2">
          <h5 style={{textTransform:'uppercase'}}>Categories</h5>
          <ListComponent
            list={this.props.list}
            actions={this.props.topic_actions}
            msg={this.props.msg.todos}
            history={this.props.history}
            />
        </div>
      </AppContentCanvas>
    )
  }

  //componentDidMount: function()
  //{
  //  if(process.env.IS_BROWSER)
  //  setTimeout(function(){
  //    let elt = this.refs.searchbox.getDOMNode();
  //    elt.focus();
  //    let queryLen = elt.value.length;
  //    // available via Caret.js
  //    $(elt).caret('pos', queryLen);
  //  }.bind(this), 1);
  //},
}