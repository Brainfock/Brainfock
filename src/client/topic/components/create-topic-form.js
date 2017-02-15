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
import ReactDOM from 'react-dom';
import Component from 'react-addons-pure-render-mixin';
import mui, {Snackbar} from 'material-ui';
import Loader from '../../components/Loader';
import SimpleFormFactory from '../../components/UISimpleFormFactory';
import SelectField from '../../components/form/RemoteSelectField.js';

/**
 * Create topic form
 *
 * @category client/components/smart
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
export default class CreateTopicForm extends React.Component {

  static defaultProps = {
    sysFields: ['namespace', 'accessPrivateYn', 'createGroup']
  };

  static propTypes = {
    actions: React.PropTypes.any.isRequired,
    containerStore: React.PropTypes.any.isRequired,
    formData: React.PropTypes.object,
    formFields: React.PropTypes.object,
    newTopic: React.PropTypes.any.isRequired,
    params: React.PropTypes.object.isRequired,
    sysFields: React.PropTypes.array,
    topicActions: React.PropTypes.any.isRequired,
    topicGroup: React.PropTypes.string.isRequired, // topic group to load form for, e.g. `issue` if we want to greate topic in group `issue`
    workspace: React.PropTypes.object,
  };

  componentWillMount() {

    if (!this.props.workspace.list.size) {
      this.props.actions.findWorkspaces();
    }

    if (!this.props.formFields || (this.props.formFields && this.props.formFields.fields.size === 0)
      || (this.props.formFields.group !== this.props.topicGroup)) {

      this.props.topicActions.loadFormFields(this.props.topicGroup,
        (this.props.containerStore ? this.props.containerStore.id : 0));
    }

    // TODO: looks like it belongs to parent component
    if (!this.props.formData) {
      this.props.topicActions.findOrCreateForm((this.props.containerStore ? this.props.containerStore.id : 0),
        this.props.topicGroup, {
          // initial values for new form
          createGroup: this.props.topicGroup,
          namespace: this.props.params.namespace
        });
    }

    if (this.props.formData &&  this.props.formFields) {

      // after we successfully loaded form fields from server - some of those fields may have had
      // default value sent by server as well, so quickly go over fields and set default values.
      this.applyDefaultFields(this.props.formFields.fields);
    } else {
      // in cases when user switched groupKey (e.g.) went from `projects` to `boards`)
      /** @see componentWillReceiveProps */
    }
  }

  applyDefaultFields(fields, overwrite = false) {

    let applyDefault = {}, hasContextField = false;
    fields.forEach(({type, name, value}) => {
      if (name === 'contextTopicId') {
        hasContextField = true;
      }
      if (value && name) {
        if (name === 'contextTopicId') {
          hasContextField = true;
        }
        if (type === 'select') {
          applyDefault[name] = [value]; // specially for `react-select`
        } else {
          applyDefault[name] = value;
        }
      }
    });

    if (this.props.containerStore) {

      applyDefault['contextTopicId'] = hasContextField === true
      ? this.props.containerStore.id
      : [
        // for `react-select` we must provide {Array} with {Object}s
        {label: this.props.containerStore.summary, value: this.props.containerStore.id}
      ];
    }

    this.props.topicActions.applyTopicFormDefaults(this.props.formData.cid, applyDefault, overwrite);
  }

  componentWillReceiveProps(newProps) {

    if (this.props.formData && newProps.formFields && this.props.formFields !== newProps.formFields) {

      this.applyDefaultFields(newProps.formFields.fields, true);
    }
  }

  //componentDidMount: function() {
  //  // focus on input:
  //  var self=this;
  //  // TODO: focusing should be done by actualt form builder during building rendering form row, possibly relying on other data to determine most important row to focus on
  //  setTimeout(function(){
  //    if(self.refs.frm) {
  //      let first_text_input = $(self.refs.frm).find('input[type=text]:first');
  //      if(first_text_input){
  //        first_text_input.focus();
  //      }
  //    }
  //  }, 300);
  //},

  /**
   * form workflow:
   *
   * 1) user selects a project.
   * 2) system loads available issue types for this project and updates "Topic Type" dropdown
   * 3) after issue type is selected, system fetches form schema for this project & topic type
   */
  render() {
    if (!this.props.formData || !this.props.formFields
    || this.props.formData.loading === true
    || this.props.formFields.group !== this.props.topicGroup) {
      return <Loader noLabel />;
    }
    return (
      <form
        className="form-horizontal"
        onSubmit={this.onFormSubmit.bind(this)}
        ref="frm" >
        {this.props.formData && this.props.formData.meta.error
        && <div className="alert alert-danger">
          <i className="fa fa-times" onClick={this.props.topicActions.cleanErrorSummary}></i> {this.props.formData.meta.error}
        </div>
        }

        {this.props.formData && this.props.formData.meta.isSubmitting
        && <Snackbar
          _action="undo"
          autoHideDuration={0}
          message="Saving..."
          openOnMount
          style={{
            bottom: 0,
            left:'30%'
          }}
          /> }

        {this.props.formData && this.props.formData.meta.postedOn
        && <Snackbar
          // TODO: action to open item details
          _action="undo"
          autoHideDuration={3000}
          message="Item created!"
          openOnMount
          postedOn={this.props.formData.meta.postedOn}
          style={{
            top: 0,
            left:'30%'
          }}
          /> }
        {this.renderForm()}
        <br />
        <mui.Checkbox
          defaultChecked={this.props.formData.data.accessPrivateYn}
          label='createForm_LABEL_access_private_yn'
          name="accessPrivateYn"
          onCheck={(function(event, isChecked) {
            this.props.topicActions.setNewTopicField({
              target:{
                name: event.target.name,
                value: isChecked
              }
            }, {cid: this.props.formData.cid});
          }).bind(this)}
          ref="accessSettings"
          value="1"
          />
      </form>
    );
  }

  /**
   * generates form based on state
   * @todo move out to a "Form Factory" component
   * @returns {XML}
   */
  renderForm() {
    if (!this.props.formFields.fields || this.props.workspace.list.size === 0) {
      return <Loader />;
    }
    if (1 === 2 && !this.props.containerStore) {

      let wspOptions = this.props.workspace.list.map(item => {
        return {
          label: item.data.name,
          value: item.data.id
        };
      });

      return (<div className="clearfix">Select Workspace
        <br />
        <SelectField label={'Workspace'} options={wspOptions.toJS()}  value=''/>
      </div>);
    } else {

      return (
      <div className="clearfix">
        <SimpleFormFactory
          form={this.props.formData}
          formScheme={this.props.formFields.fields}
          handleSubmit={this.onFormSubmit.bind(this)}
          modelValues={this.props.formData.data}
          onChange={this.onChange.bind(this)}
          primaryInputName='summary'
          />
      </div>
    );
    }
  }

  onChange(e) {
    this.props.topicActions.setNewTopicField(e, {cid: this.props.formData.cid});
  }

  onFormSubmit(e) {

    const {topicActions, formData} = this.props;

    const cid = formData.cid;
    const data = formData.toJS().data;

    // normalize inputs from forms elements
    this.props.formFields.fields.forEach(function({type, name}) {
      // `react-select` stores sigle value as an array too
      if (type === 'select' && data[name]) {
        if (data[name].length > 0 || data[name].value)
          data[name] = data[name] ? (data[name].value ? data[name].value
            : (data[name][0].value ? data[name][0].value : null)) : null;
      }
    });

    let postData = {};
    this.props.formFields.fields.forEach(function(field) {
      postData[field.name] = data[field.name];
    });

    this.props.sysFields.forEach(function(field) {
      if (field && typeof field !== undefined) {
        postData[field] = data[field];
      }
    });

    if (this.props.containerStore && !postData.contextTopicId)
      postData.contextTopicId = this.props.containerStore.id;

    //actions.create(postData)
    topicActions.postTopicFormData(cid, postData)
      .then(({error, payload}) => {
        if (error) {
          // TODO: snackbar message?
          //focusInvalidField(this, payload);
        } else {
          const node = ReactDOM.findDOMNode(this);
          if (!node) return;
          let el = node.querySelector('[name="summary"]');
          if (el) {
            el.focus();
          }
        }
      });
  }
}
