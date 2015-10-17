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

import mui from 'material-ui-io';
import Loader from '../../components/Loader';
import SimpleFormFactory from '../../components/UISimpleFormFactory';

/**
 * Create topic form component
 *
 * @author sergii gamaiunov <Hello@webkadabra.com>
 */
export default class CreateTopicForm extends Component{

  static defaultProps = {
    sysFields: ['namespace','accessPrivateYn','createGroup']
  };

  static propTypes = {
    containerStore: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    formFields: React.PropTypes.object,
    actions: React.PropTypes.any.isRequired,
    // topic group to load form for, e.g. `issue` if we want to greate topic in group `issue`
    topicGroup: React.PropTypes.string.isRequired,
  };

  componentWillMount() {
    if(!this.props.formFields || (this.props.formFields && this.props.formFields.fields.size==0))
      this.props.actions.loadFormFields(this.props.topicGroup, this.props.containerStore.id);
  }

  componentDidMount() {
    // set default values based on current route (workspace namespace) and container topic (e.g. project topic)
    this.props.actions.setNewTopicField({target:{
      name: 'namespace',
      value: this.props.params.namespace,
    }});
    this.props.actions.setNewTopicField({target:{
      name: 'createGroup',
      value: this.props.topicGroup,
    }});

    this.props.actions.setNewTopicField({target:{
      name: 'contextTopicId',
      value: [
        // for `react-select` we must provide {Array} with {Object}s
        {label:this.props.containerStore.summary,value:this.props.containerStore.id}
      ]
    }})
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
  render()
  {
    return <form ref="frm" onSubmit={this.onFormSubmit.bind(this)} className="form-horizontal">
      {this.renderForm()}
      <br />

      <mui.Checkbox
        name="accessPrivateYn" ref="accessSettings" value="1"
        label='createForm_LABEL_access_private_yn'
        onCheck={(function(event, isChecked){
              this.props.actions.setNewTopicField({
                target:{
                  name: event.target.name,
                  value: isChecked
                }
              })
             }).bind(this)}
        />
    </form>

  }

  /**
   * generates form based on state
   * @todo move out to a "Form Factory" component
   * @returns {XML}
   */
  renderForm() {
    if(!this.props.formFields.fields) {
      return <Loader />;
    }
    return <div className="clearfix">
      <SimpleFormFactory
        formScheme={this.props.formFields.fields}
        onChange={this.props.actions.setNewTopicField}
        modelValues={this.props.newTopic}
        />
    </div>
  }

  onFormSubmit(e)
  {
    const {actions, newTopic} = this.props;

    // we need to call `.toJS()` ince `newTopic` is immutable
    let data = newTopic.toJS();

    // normalize inputs from forms elements
    ['contextTopicId','typeId'].forEach(propName => data[propName] = data[propName][0].value)

    let postData={};
    this.props.formFields.fields.forEach(function(field){
      postData[field.name] = data[field.name]
    });

    this.props.sysFields.forEach(function(field){
      if(field && typeof field !== undefined) {
        postData[field] = data[field]
      }
    });

    actions.create(postData)
      .then(({error, payload}) => {
        if (error) {
          alert('Error! Check console');
          console.log(error);
          //focusInvalidField(this, payload);
        } else {
          // item added successfully
        }
      });
  }
}
