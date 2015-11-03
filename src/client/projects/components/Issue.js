/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov
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
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {RaisedButton, Paper, Card, CardHeader, CardText, Avatar, FlatButton, Dialog} from 'material-ui';
import OperationsDropdown from './OperationsDropdown.js'
import Loader from '../../components/Loader.js'
import Comments from '../../topic/components/comments';
import {FormattedDate} from 'react-intl';

export default class Issue extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    io: PropTypes.object.isRequired,
    isBirdview: PropTypes.bool,
    onDeleted: PropTypes.func,
    topic: PropTypes.object.isRequired,
    topic_actions: PropTypes.object.isRequired
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };
  }

  /**
   * @todo l10n
   * @returns {XML}
   */
  render() {

    const topic = this.props.topic;

    const displayDate = (
      topic.createdOn || topic.updatedOn
        ?
        <span>
        {!topic.createdOn && topic.updatedOn && <em>Updated on </em>}
          <FormattedDate value={topic.createdOn || topic.updatedOn}/>
      </span>
        :
        null
    );

    const WrapperEl = topic.deletedYn === 1 ? 's' : 'span';
    return (
      <div>
        <WrapperEl>
          {topic.loading && <div style={{position:'absolute',width:'100%'}}><Loader noLabel/></div>}

          <OperationsDropdown
            activeStageId={topic.workflowStageId}
            operations={topic.operations}
            handleOperation={this.applyOperation.bind(this)}
            onSelectDelete={this.showDeletePrompt.bind(this)}
            />
          {topic &&
          <h2 style={{fontWeight:800}}>
            {topic.summary}
            <span className="label label-primary ">
              {topic.wfStage}
            </span>
          </h2>}</WrapperEl>
        <Card>
          <CardHeader
            avatar={topic.author.username && <Avatar>{topic.author.username.charAt(0)}</Avatar>}
            subtitle={displayDate}
            title={topic.author && <b>{topic.author.username}</b>}
            />
          {topic.text &&
          <CardText>{topic.text}</CardText>}
        </Card>

        <div style={{paddingTop:this.context.muiTheme.rawTheme.spacing.desktopGutter}}>
          {this.comments()}
        </div>
        {this.renderDeleteDialog()}
      </div>
    );
  }

  /**
   * update status
   *
   * @param opName
   * @private
   */
  applyOperation(opName) {
    this.props.topic_actions.runOperation(this.props.topic.id, opName);
  }

  renderDeleteDialog() {

    let disabled = false;
    if (this.props.topic.loading === true) {
      disabled = true;
    }
    let dialogActions = [
      <FlatButton
        label='BTN_CANCEL'
        onClick={this.handleCloseDialog}
        onTouchTap={this.handleCloseDialog}
        ref='BTN_CANCEL'
        secondary
        />,
      <FlatButton
        disabled={disabled}
        label='BTN_DELETE'
        onClick={this.doDelete.bind(this)}
        primary
        ref='BTN_DELETE'
        />
    ];

    // TODO: make dynamic messages per type, like l20n.ctx.getSync(this.state.model.type.name + '_deleteDialog_MESSAGE') ?

    return (
      <Dialog
        actions={dialogActions}
        ref='deletePrompt'
        title='Topic_deleteDialog_TITLE'
        >
        {this.props.topic.meta.error && <div className="alert alert-warning">{this.props.topic.meta.error}</div>}
        <p>'Topic_deleteDialog_MESSAGE'</p>
      </Dialog>
    );
  }

  showDeletePrompt() {
    this.refs.deletePrompt.show();
    // focus on "Cancel" action by default
    if (this.refs.BTN_CANCEL) {
      setTimeout(function() {
        this.refs.BTN_CANCEL.getDOMNode().focus();
      }.bind(this), 10);
    }
  }

  handleCloseDialog() {
    this.refs.deletePrompt.dismiss();
  }

  doDelete() {
    this.props.topic_actions.deleteTopic(this.props.topic.id)
      .then(({error, payload}) => {
        if (!error) {
          this.handleCloseDialog();
          if (this.props.onDeleted) {
            this.props.onDeleted();
          }
        }
      })
      .catch((rest)=> {});
  }

  /**
   *
   * @returns {XML}
   */
  comments() {
    if (this.props.topic.type && this.props.topic.type.commentsEnabled) {
      return (
        <Comments
          topic={this.props.topic}
          comments={this.props.topic.comments}
          io={this.props.io}
          actions={this.props.actions}/>
      );
    } else {
      return null;
    }
  }
}
