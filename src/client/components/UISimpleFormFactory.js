/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';
import Component from 'react-pure-render/component';
import mui from 'material-ui';
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
    form: React.PropTypes.any.isRequired,
    formScheme: React.PropTypes.any.isRequired,
    handleSubmit: React.PropTypes.func,
    modelValues: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    primaryInputName: React.PropTypes.string
  };

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
    });
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
    });
  }

  onKeyDown(e) {
    if (e.key === 'Enter')
      this.props.handleSubmit();
  }

  /**
   * Render single form field
   *
   * @param {Object} item
   * @returns {XML}
   */
  renderItem(item) {

    const meta = this.props.form.meta;
    let props = {name: item.name};

    if (this.props.primaryInputName && this.props.primaryInputName === item.name) {
      props.onKeyDown = this.onKeyDown.bind(this);
    }

    if (this.props.modelValues && this.props.modelValues[item.name]) {
      props.value = this.props.modelValues[item.name];
    } else {
      if (item.value) props.value = item.value;
    }

    if (item.type === 'select' || item.type === 'multiselect') {

      props.placeholder = item.label;
      props.options = item.options || [];
      props.style = {width:'100%'};
      props.width = '100%';

      if (meta.errors && meta.errors.get(item.name)) {
        if (meta.isSubmitting === true) {
          props.errorText = <i className="fa fa-spin fa-cog"></i>;
        } else {
          props.errorText = meta.errors.get(item.name);
        }
      }

      if (item.type === 'multiselect') props.multi = true;

      props.onChange = (function(newValue, newValues) {
        // in case of multiselect, pass `newValues` - form data has to be normalized before POSTing, see actions
        this.onReactSelectChange(newValue, newValues, item.name)}).bind(this);

      // `react-select` does not like unset value, at least empty {String} is required
      if (!props.value) props.value = '';

      let FilterComponent = Select;

      if (item.endpoint) {
        props.endpoint = item.endpoint;
        if (item.endpointQueryString) {
          props.endpointQueryString = item.endpointQueryString;
        }
        if (item.endpointIncludeValues) {

          for (let includeSettings of item.endpointIncludeValues) {
            for (let prop in includeSettings) {

              if (this.props.form.data[prop]) {

                const filterValue = this.props.form.data[prop].length > 0
                  ? this.props.form.data[prop][0].value
                  : this.props.form.data[prop][0];

                props.endpoint += '&'+includeSettings[prop]+filterValue;
              }
            }
          }
          props.endpointIncludeValues = item.endpointIncludeValues;
        }
        FilterComponent = RemoteSelectField;
      }

      return (
        <div  style={{'width':'100%'}}>
          <RemoteSelectField {...props} />
        </div>
      );

    } else if ('text' === item.type || 'textarea' === item.type) {

      props.floatingLabelText = item.label + ':';
      props.hintText = item.description;
      props.fullWidth = true;

      if (this.props.form.meta.errors && this.props.form.meta.errors.get(item.name)) {
        props.errorText = this.props.form.meta.errors.get(item.name);
      }

      if ('textarea' === item.type) {
        props.multiLine = true;
      }

      let Filter = (
        <mui.TextField
          {...props}
          onChange={this.props.onChange}
          />
      );

      return (
        <div  style={{'width':'100%'}}>
          {Filter}
        </div>
      );

    } else if ('checkbox' === item.type) {

      props.label = item.label;
      if (item.value === true) props.defaultChecked = true;

      return (
        <div  style={{'width':'100%'}}>
          <mui.Checkbox
            {...props}
            onCheck={(function(event, isChecked){
              this.props.onChange({
                target:{
                  name: event.target.name,
                  value: isChecked
                }
              });
             }).bind(this)}
            />
        </div>
      );

    } else if ('datetime' === item.type) {

      props.hintText = item.description;
      props.floatingLabelText = item.label + ':';
      props.style = {
        width:'100%'
      };

      if (item.value) props.defaultValue = item.value;

      let Datepicker = (
        <mui.DatePicker {...props}
          onChange={(nill, newDate)=>{this.onDatepickerChange(newDate, item.name)}.bind(this)}
        />
      );

      // TODO: Add timepicker
      //let Timepicker = <mui.TimePicker  {...props}  />;
      return (
        <div  style={{'width':'100%'}}>
          {Datepicker}
        </div>
      );

    } else {
      // unknown field
      return null;
    }
  }
};

module.exports = Page;
