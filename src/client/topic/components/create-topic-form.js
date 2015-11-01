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
import React from 'react';
import Component from 'react-pure-render/component';

import mui, {FlatButton} from 'material-ui';
import Loader from '../../components/Loader';
import SimpleFormFactory from '../../components/UISimpleFormFactory';

/**
 * Create topic form component
 *
 * @author sergii gamaiunov <Hello@webkadabra.com>
 */
export default class CreateTopicForm extends Component {

  static defaultProps = {
    sysFields: ['namespace', 'accessPrivateYn', 'createGroup']
  };

  static propTypes = {
    actions: React.PropTypes.any.isRequired,
    newTopic: React.PropTypes.any.isRequired,
    containerStore: React.PropTypes.any.isRequired,
    formFields: React.PropTypes.object,
    params: React.PropTypes.object.isRequired,
    // topic group to load form for, e.g. `issue` if we want to greate topic in group `issue`
    topicGroup: React.PropTypes.string.isRequired
  };

  componentWillMount() {
    if (!this.props.formFields || (this.props.formFields && this.props.formFields.fields.size === 0)
      || (this.props.formFields.group !== this.props.topicGroup)) {
      this.props.actions.loadFormFields(this.props.topicGroup, (this.props.containerStore ? this.props.containerStore.id : 0));
    }
  }

  componentDidMount() {
    // set default values based on current route (workspace namespace) and container topic (e.g. project topic)
    if (this.props.params.namespace)
      this.props.actions.setNewTopicField({target:{
        name: 'namespace',
        value: this.props.params.namespace,
      }});
    this.props.actions.setNewTopicField({target:{
      name: 'createGroup',
      value: this.props.topicGroup,
    }});

    if (this.props.containerStore)
      this.props.actions.setNewTopicField({target:{
        name: 'contextTopicId',
        value: [
          // for `react-select` we must provide {Array} with {Object}s
          {label:this.props.containerStore.summary,value:this.props.containerStore.id}
        ]
      }});
  }

  componentWillReceiveProps(newProps) {

    if (newProps.formFields && this.props.formFields != newProps.formFields) {

      //  after we successfully loaded form fields from server - some of those fields may have had
      // default value sent by server as well, so quickly go over fields and set default values.
      newProps.formFields.fields.forEach((fieldScheme) => {
        if (fieldScheme.value && fieldScheme.name) {
          console.log('> setNewTopicField')
          this.props.actions.setNewTopicField({
            target: {
              name: fieldScheme.name,
              value: fieldScheme.value
            }
          });
        }
      });
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
    return (
      <form ref="frm" onSubmit={this.onFormSubmit.bind(this)} className="form-horizontal">
        {this.props.form && this.props.form.meta.error
        && <div className="alert alert-danger">
          <i onClick={this.props.actions.cleanErrorSummary} className="fa fa-times"></i> {this.props.form.meta.error}
        </div>
        }
        {this.renderForm()}
        <br />
        <mui.Checkbox
          defaultChecked={this.props.newTopic.accessPrivateYn}
          label='createForm_LABEL_access_private_yn'
          name="accessPrivateYn"
          onCheck={(function(event, isChecked){
                this.props.actions.setNewTopicField({
                  target:{
                    name: event.target.name,
                    value: isChecked
                  }
                })
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
    if (!this.props.formFields.fields) {
      return <Loader />;
    }
    return (
      <div className="clearfix">
        <SimpleFormFactory
          formScheme={this.props.formFields.fields}
          onChange={this.props.actions.setNewTopicField}
          modelValues={this.props.newTopic}
          form={this.props.form}
          />
      </div>
    );
  }

  onFormSubmit(e) {
    const {actions, newTopic} = this.props;

    // we need to call `.toJS()` ince `newTopic` is immutable
    let data = newTopic.toJS();
    console.log('> postData', data)

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

    actions.create(postData)
      .then(({error, payload}) => {
        if (error) {
          // TODO: snackbar message?
          //focusInvalidField(this, payload);
        } else {
          // item added successfully
        }
      });
  }

  handleDataSubmit(data) {

    const {actions, newTopic} = this.props;

    // normalize inputs from forms elements
    this.props.formFields.fields.forEach(function ({type, name}) {
      // `react-select` stores sigle value as an array too
      if (type === 'select' && data[name]) {
        if (data[name].length > 0 || data[name].value)
          data[name] = data[name] ? (data[name].value ? data[name].value
            : (data[name][0].value ? data[name][0].value : null)) : null;
      }
    });

    let postData = {};
    this.props.formFields.fields.forEach(function (field) {
      postData[field.name] = data[field.name];
    });

    this.props.sysFields.forEach(function (field) {
      if (field && typeof field !== undefined) {
        postData[field] = data[field];
      }
    });

    if (this.props.containerStore && !postData.contextTopicId)
      postData.contextTopicId = this.props.containerStore.id;

    actions.create(postData)
      .then(({error, payload}) => {
        if (error) {
          alert('Error! Check console');
          //focusInvalidField(this, payload);
        } else {
          // item added successfully
        }
      });

  }
}
