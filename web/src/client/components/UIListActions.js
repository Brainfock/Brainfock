var React = require('react');
var mui = require('material-ui');

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
      <mui.RaisedButton primary={true}  onClick={this.showModelForm} label={this.props.BUTTON_ACTION_LABEL

            }/>
      {this.renderModelForm()}
    </div>;
  },

  renderModelForm: function()
  {
    if(!this.props.FormComponent) {
      return null;
    }

    var dialogActions = [
      { text: 'BTN_CANCEL', onClick: this._onDialogCancel  },
      { text: this.props.BUTTON_SUBMIT_LABEL, onClick: this.handleSubmit }
    ];

    if(this.props.FormStore.get('loading')==true) {
      //Custom Actions
      dialogActions = [
        <mui.FlatButton
            label='BTN_CANCEL'
            secondary={true}
            disabled={false}
            onTouchTap={this._onDialogCancel} />,
        <mui.FlatButton
            label='BTN_LOADING'
            primary={true}
            disabled={true}
            onTouchTap={this.handleSubmit} />
      ];
    }

    let Form = this.props.FormComponent;

    return <mui.Dialog title={this.props.TITLE} ref="modelForm" actions={dialogActions}>
      <Form
          ref="formView"
          ContainerStore={this.props.containerStore}
          FormStore={this.props.FormStore}
          Actions={this.props.Actions}
          />
    </mui.Dialog>
  },

  /**
   * new project form submitted
   */
  handleSubmit: function(e)
  {
    e.preventDefault();
    this.refs.formView.handleSubmit(e);
  },

  showModelForm: function() {
    //ProjectsActions.fetch();
    this.refs.modelForm.show();
  },

  _onDialogCancel:function() {
    this.refs.modelForm.dismiss();
  }
});

module.exports=ListActions;