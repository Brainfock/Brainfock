/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
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
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
var React = require('react');
var mui = require('material-ui-io');

var ListActions =  React.createClass({

  getDefaultProps: function() {
    return {
      containerStore: null,
      FormStore: null,
      Actions: null,
      FormComponent: null,
      BUTTON_ACTION_LABEL: 'INVITE PEOPLE',
      BUTTON_SUBMIT_LABEL: 'BTN_CREATE',
      TITLE: 'Add New'
    };
  },

  componentDidMount: function()
  {
    // form submission (loading state)
    if(this.props.FormStore)
    {
      this.props.FormStore.on('change', function() {
        this.forceUpdate();
      }, this);
    }
  },

  componentWillUnmount: function() {
    if(this.props.FormStore) {
      this.props.FormStore.off(null, null, this);
    }
  },

  render: function() {
    return <div className="pull-right">
      <mui.RaisedButton primary={true} onClick={this.showModelForm} label={this.props.BUTTON_ACTION_LABEL}/>
      {this.renderModelForm()}
    </div>;
  },

  renderModelForm: function()
  {
    if(!this.props.FormComponent) {
      return null;
    }

    var dialogActions = [
      { text: this.props.msg.form.button.cancel, onClick: this._onDialogCancel  },
      { text: this.props.msg.form.button.create, onClick: this.onFormSubmit }
    ];

    if(this.props.formFields.loading==true) {
      // disable all buttons while form is being processed
      dialogActions = [
        <mui.FlatButton
            label={this.props.msg.form.button.cancel}
            secondary={true}
            disabled={true}
            onTouchTap={this._onDialogCancel} />,
        <mui.FlatButton
            label={this.props.msg.form.button.create}
            primary={true}
            disabled={true}
            onTouchTap={this.onFormSubmit} />
      ];
    }

    let Form = this.props.FormComponent;

    return <mui.Dialog title={this.props.TITLE} ref="modelForm" actions={dialogActions}>
      <Form
          ref="formView"
          containerStore={this.props.containerStore}
          newTopic={this.props.newTopic}
          formFields={this.props.formFields}
          actions={this.props.actions}
          params={this.props.params}
          />
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