/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {RaisedButton, FlatButton, Dialog} from 'material-ui';

let ListActions =  React.createClass({
  propTypes: {
    addItemForm: React.PropTypes.element,
    //buttonActionLabel: React.PropTypes.string,
    buttonActionLabel: React.PropTypes.string,
    isLoading: React.PropTypes.bool,
    msg: React.PropTypes.object,
    title: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      actions: null,
      //buttonActionLabel: 'BTN_CREATE',
      buttonActionLabel: 'INVITE PEOPLE',
      isLoading: false,
      title: 'Add New',
    };
  },

  render() {
    return (<div className="pull-right">
      <RaisedButton
        label={this.props.buttonActionLabel}
        onClick={this.showModelForm}
        primary
        />
      {this.renderModelForm()}
    </div>);
  },

  renderModelForm() {
    let dialogActions = [
      {text: this.props.msg.form.button.cancel, onClick: this._onDialogCancel},
      {text: this.props.msg.form.button.create, onClick: this.onFormSubmit}
    ];
    if (this.props.isLoading === true) {
      // disable all buttons while form is being processed
      dialogActions = [
        <FlatButton
            disabled
            label={this.props.msg.form.button.cancel}
            onTouchTap={this._onDialogCancel}
            secondary
          />,
        <FlatButton
            disabled
            label={this.props.msg.form.button.create}
            onTouchTap={this.onFormSubmit}
            primary
          />
      ];
    }

    const addItemForm = React.cloneElement(this.props.addItemForm, {
      ref: 'formView'
    });

    return (<Dialog
      actions={dialogActions}
      autoDetectWindowHeight
      autoScrollBodyContent
      ref="modelForm"
      title={this.props.title}
      >
      {addItemForm}
    </Dialog>);
  },

  showModelForm() {
    this.refs.modelForm.show();
  },

  _onDialogCancel() {
    this.refs.modelForm.dismiss();
  },

  onFormSubmit(e) {
    this.refs.formView.onFormSubmit(e);
  }
});

module.exports = ListActions; // eslint-disable-line no-undef
