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
import Select from 'react-select';

import Loader from './Loader';
import RemoteSelectField from './form/RemoteSelectField';

/**
 * Simple factory to build basic forms' UIs;
 *
 * Supports text inputs, selects and multiselects with (optional) feature to load options asynchronously (autocomplete);
 *
 * @todo i18n
 * @todo complete `datetime` type support
 * @todo improve documentation
 * @author sergii gamaiunov <hello@webkadabra.com>
 * @type {*|exports|module.exports}
 */
class Page extends Component{

  static propTypes = {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
    formScheme: React.PropTypes.any.isRequired,
    handleSubmit: React.PropTypes.func,
    onChange: React.PropTypes.func.isRequired,
    modelValues: React.PropTypes.object,
  }

  render() {
    return this.renderForm();
  }

  /**
   * generates form based on state
   * @returns {XML}
   */
  renderForm() {
    if(!this.props.formScheme) {
      return <div></div>;
    }
    return <div className="clearfix">
      {this.props.formScheme.map(this.renderItem.bind(this))}
      { /*<mui.RaisedButton primary={true} onClick={this.handleSubmit} label="Save" />*/ }
    </div>
  }

  /**
   * handle change event coming from `react-select` component - provide standard-like object for change event
   *
   * @param {number} newValue
   * @param {Array} newValues
   * @param {string} fieldName Field name
   */
  onReactSelectChange(newValue, newValues, fieldName) {
    this.props.onChange({
      target: {
        name:fieldName,
        value:newValues
      }
    })
  }

  /**
   * handle change event coming from `material-ui` `DatePicker` component - provide standard-like object for change event
   *
   * @param {string} newDate
   * @param {string} fieldName Field name
   */
  onDatepickerChange(newDate, fieldName) {
    this.props.onChange({
      target: {
        name:fieldName,
        value:newDate
      }
    })
  }

  /**
   * Render single form field
   *
   * @param {Object} item
   * @returns {XML}
   */
  renderItem(item)
  {
    if(item.type == 'select' || item.type == 'multiselect')
    {

      let props = {
        name:item.name,
        placeholder:item.label,
        //options:item.options,
        style:{
          width:'100%'
        },
        width:'100%'
      };
      if(item.type == 'multiselect') {
        props.multi = true;
      }

      if(this.props.modelValues && this.props.modelValues[item.name]){
        props.value = this.props.modelValues[item.name];
      } else {
        if(item.value) {
          props.value = item.value;
        }
      }

      //if(this.props.preselected && this.props.preselected[item.name])
      //  props.value = this.props.preselected[item.name];

      let FilterComponent = Select;
      if(item.endpoint) {
        props.endpoint = item.endpoint;
        FilterComponent = RemoteSelectField;
      }

      return (
        <div  style={{'width':'100%'}}>
          <FilterComponent {...props}
            //onBlur={this.onReactSelectChange.bind(this)}
            onChange={(function(newValue, newValues){this.onReactSelectChange(newValue, newValues, item.name)}).bind(this)}
            />
        </div>
      );
    }

    // text input
    else if('text'==item.type || 'textarea' == item.type)
    {
      let props = {
        name:item.name,
        hintText:item.description,
        floatingLabelText:item.label + ':',

        style:{
          width:'100%'
        },
      };
      if('textarea' == item.type) {
        props.multiLine=true;
      }

      if(this.props.modelValues && this.props.modelValues[item.name]){
        props.value = this.props.modelValues[item.name];
      } else {
        // preselected
        if(item.value) {
          props.value = item.value;
        }
      }

      let Filter = (
        <mui.TextField
          {...props}
          onChange={this.props.onChange}
          />
      );
      return <div  style={{'width':'100%'}}>
        {Filter}</div>;
    }
    // text input
    else if('checkbox'==item.type)
    {
      let props = {
        name:item.name,
        label:item.label,

      };

      // checked
      if(item.value==true) {
        props.defaultChecked = true;
      }

      return (
        <div  style={{'width':'100%'}}>
          <mui.Checkbox
            {...props}
            onChange={this.props.onChange}
            />
        </div>
      );
    }
    // datetime picker
    else if('datetime'==item.type)
    {
      let props = {
        name:item.name,
        hintText:item.description,
        floatingLabelText:item.label + ':',

        style:{
          width:'100%'
        },
      };
      if('textarea' == item.type) {
        props.multiLine=true;
      }
      // preselected
      if(item.value) {
        props.defaultValue = item.value;
      }

      let Datepicker = <mui.DatePicker
        {...props}
        onChange={(function(nill, newDate){this.onDatepickerChange(newDate, item.name)}).bind(this)}
        />;

      // TODO: Add timepicker
      //let Timepicker = <mui.TimePicker  {...props}  />;
      return <div  style={{'width':'100%'}}>
        {Datepicker}</div>;
    }
    return <span className="badge">{item.label}</span>
  }
};

module.exports = Page;