/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var mui = require('material-ui');
import cloneWithProps from 'react-addons-clone-with-props';

var ListActions =  React.createClass({

  getDefaultProps: function() {
    return {
      isLoading: false,
      actions: null,
      BUTTON_ACTION_LABEL: 'INVITE PEOPLE',
      BUTTON_SUBMIT_LABEL: 'BTN_CREATE',
      TITLE: 'Add New'
    };
  },

  render: function() {
    return <div className="pull-right">
      <mui.RaisedButton primary={true} onClick={this.showModelForm} label={this.props.BUTTON_ACTION_LABEL}/>
      {this.renderModelForm()}
    </div>;
  },

  renderModelForm: function()
  {
    var dialogActions = [
      { text: this.props.msg.form.button.cancel, onClick: this._onDialogCancel  },
      { text: this.props.msg.form.button.create, onClick: this.onFormSubmit }
    ];

    if(this.props.isLoading === true) {
      // disable all buttons while form is being processed
      dialogActions = [
        <mui.FlatButton
            label={this.props.msg.form.button.cancel}
            secondary
            disabled
            onTouchTap={this._onDialogCancel} />,
        <mui.FlatButton
            label={this.props.msg.form.button.create}
            primary
            disabled
            onTouchTap={this.onFormSubmit} />
      ];
    }

    const addItemForm = React.cloneElement(this.props.addItemForm, {
      ref: 'formView'
    });

    return <mui.Dialog
      actions={dialogActions}
      autoDetectWindowHeight={true}
      autoScrollBodyContent={true}
      ref="modelForm"
      title={this.props.TITLE}
      >
      {addItemForm}
    </mui.Dialog>
  },

  showModelForm: function() {
    this.refs.modelForm.show();
  },

  _onDialogCancel:function() {
    this.refs.modelForm.dismiss();
  },

  onFormSubmit:function(e) {
    this.refs.formView.onFormSubmit(e)
  }
});

module.exports=ListActions;
