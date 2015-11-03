/**
 * Brainfock - business & community management software
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
import {RaisedButton, Paper, FlatButton, Dialog} from 'material-ui';

export default class ConfirmDialog extends Component {

  static propTypes = {
    operations: PropTypes.array.isRequired,
    onSelectDelete: PropTypes.func.isRequired,
    activeStageId: PropTypes.any,

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
    if (this.props.topic.loading === true) {
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
        ref='deletePrompt'
        openImmediately={this.props.show}
        onDismiss={this.props.onDismiss}
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
    this.props.deleteAction(this.props.topic.id)
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
}
