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
import ReactDOM from 'react-dom';
import {FlatButton, Dialog} from 'material-ui';

export default class ConfirmDialog extends Component {

  static propTypes = {
    activeStageId: PropTypes.any,
    deleteAction: PropTypes.function,
    onDelete: PropTypes.function,
    onDismiss: PropTypes.function,
    onSelectDelete: PropTypes.func.isRequired,
    operations: PropTypes.array.isRequired,
    show: PropTypes.bool,
    topic: PropTypes.object,
  };

  render() {
    return this.renderDeleteDialog();
  }

  componentDidUpdate() {
    if (this.props.show === true) {
      this.showDeletePrompt();
    }
  }
  renderDeleteDialog() {

    let disabled = false;
    if (this.props.topic.meta.isFetching === true) {
      disabled = true;
    }
    let dialogActions = [
      <FlatButton
        label='BTN_CANCEL'
        onClick={this.handleCloseDialog.bind(this)}
        onTouchTap={this.handleCloseDialog.bind(this)}
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
        onDismiss={this.props.onDismiss}
        openImmediately={this.props.show}
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
        ReactDOM.findDOMNode(this.refs.BTN_CANCEL).focus();
      }.bind(this), 10);
    }
  }

  handleCloseDialog() {
    this.refs.deletePrompt.dismiss();
  }

  doDelete() {
    this.props.deleteAction(this.props.topic.data.id)
      .then(({error, payload}) => {
        if (!error) {
          this.handleCloseDialog();
          if (this.props.onDelete) {
            this.props.onDelete();
          }
        }
      })
      .catch((rest)=> {});
  }
}
