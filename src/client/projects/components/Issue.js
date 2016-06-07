/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Card, CardHeader, CardText, Avatar, FlatButton, Dialog} from 'material-ui';
import OperationsDropdown from './OperationsDropdown.js';
import Loader from '../../components/Loader.js';
import Comments from '../../topic/components/comments';
import {FormattedDate} from 'react-intl';
import {TextField} from 'material-ui';

export default class Issue extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    io: PropTypes.object.isRequired,
    isBirdview: PropTypes.bool,
    onDeleted: PropTypes.func,
    topic: PropTypes.object.isRequired,
    topicActions: PropTypes.object.isRequired
  };

  static defaultProps = {
    isBirdview: false
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
          {topic.loading && <div style={{position:'absolute', width:'100%'}}><Loader noLabel/></div>}

          <OperationsDropdown
            activeStageId={topic.workflowStageId}
            handleOperation={this.applyOperation.bind(this)}
            onSelectDelete={this.showDeletePrompt.bind(this)}
            operations={topic.operations}
            />


          {topic &&
            this.state.showForm &&
          <TextField
            value={topic.summary}
            />}

          {topic &&
          this.state.showForm &&
          <a href={'#'} onClick={()=>{this.setState({'showForm': false});}}>[save]</a>}

          {topic &&
          <h2 style={{
            fontWeight:800,
            display: (this.state.showForm === false ? 'inline' : 'none')
          }}>
            {!this.props.isBirdview &&
            <span
              className="stats"
              title={`ID ${topic.id}`}>
              <span className="prop" style={{
                fontSize: '14pt',
                margin: '0 5px 0px 0px',
                lineHeight: '18pt',
                verticalAlign: 'text-bottom'
              }}>#{topic.contextTopicNum}</span></span>}
            {topic.summary}
            <a href={'#'} onClick={()=>{this.setState({'showForm': true});}}>[edit]</a>
            <span className="label label-primary ">
              {topic.wfStage}
            </span>
          </h2>}

        </WrapperEl>
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
    this.props.topicActions.runOperation(this.props.topic.id, opName);
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
    this.props.topicActions.deleteTopic(this.props.topic.id)
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
    if (this.props.topic.type && this.props.topic.type.commentsEnabled && !this.props.topic.loading) {
      return (
        <Comments
          actions={this.props.actions}
          comments={this.props.topic.comments}
          io={this.props.io}
          topic={this.props.topic}
          />
      );
    } else {
      return null;
    }
  }
}
