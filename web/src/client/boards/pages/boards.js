import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Router from 'react-router';

var AppContentCanvas = require('../../components/layout/AppContentCanvas');
var ListActions =  require('../../components/UIListActions');

var EmptyComponent =  React.createClass({
  // TODO: i18n
  render: function() {
    return <div className="alert alert-info">
      <p>Projects_ListEmpty</p>
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
   // topicType: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  }

  /**
   * initialize data
   */
  componentWillMount() {
    // pull all topics (projects) from server - this list is filtered by client
    if(process.env.IS_BROWSER==true) {
      this.props.topic_actions.find(this.props.group.groupKey, {}/*, this.props.parentModel*/);
    }
  }

  render() {
    let header = <div>
      {this.props.board.group && <h4>{this.props.board.group.name}</h4>}
      {!this.props.board.group && <h4>Loading...</h4>}
    </div>;

    if(this.props.meta.loading==true) {
      return <h3>Loading...</h3>
    }

    return (
      <AppContentCanvas header={header}>
        <div className="col-md-7 col-md-offset-2">
          { /*<h5 style={{textTransform:'uppercase'}}>Categories</h5> */ }
          <ListComponent
            list={this.props.list}
            actions={this.props.topic_actions}
            msg={this.props.msg.todos}
            history={this.props.history}
            group={this.props.group}
            board={this.props.board}
            params={this.props.params}
            />
        </div>
      </AppContentCanvas>
    )
  }

  // TODO: add
  //componentDidMount()
  //{
  //  if(process.env.IS_BROWSER)
  //  setTimeout(function(){
  //    let elt = this.refs.searchbox.getDOMNode();
  //    elt.focus();
  //    let queryLen = elt.value.length;
  //    // available via Caret.js
  //    $(elt).caret('pos', queryLen);
  //  }.bind(this), 1);
  //}
}