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
var l20n = require('common/l20n/l20n.jsx'), {Entity} = l20n;
var Loader = require('./Loader');

var Page = React.createClass({

  getDefaultProps() {
    return {
      formScheme:null,
      handleSubmit:function(){}
    }
  },

  render: function() {
    return (
        <div>
          {this.renderForm()}
        </div>
    );
  },

  /**
   * generates form based on state
   * @todo move out to a "Form Factory" component
   * @returns {XML}
   */
   renderForm() {
    if(!this.props.formScheme) {
      return <div>Empty Form!</div>;
    }
    return <div className="clearfix">
      {this.props.formScheme.map(this.renderItem)}

      <mui.RaisedButton primary={true} onClick={this.handleSubmit} label={<Entity entity="Save" />} />
    </div>
  },

  filters:[],

  /**
   * simple form factory
   * todo: move out to a reusable component
   * @param item - each item is represented by ListFieldItem.php in backend
   * @returns {XML}
   */
  renderItem:function(item)
  {
    /** @link https://github.com/JedWatson/react-select */
    let Select = require('react-select');

    if(item.type == 'select' || item.type == 'multiselect')
    {
      let props = {
        name:item.id,
        placeholder:item.label,
        options:item.options,
        style:{
          width:'100%'
        },
        width:'100%'
      };
      if(item.type == 'multiselect') {
        props.multi = true;
      }

      // preselected
      if(item.value) {
        props.value = item.value;
      }

      props.ref = item.id;
      this.filters.push(props.ref);

      if(this.props.preselected && this.props.preselected[item.id])
        props.value = this.props.preselected[item.id];

      let Filter = <Select
          {...props}
          onChange={this.onFilterChange}
          />;
      return <div  style={{'width':'100%'}}>
        {Filter}</div>;
    }

    // text input
    else if('text'==item.type || 'textarea' == item.type)
    {
      let props = {
        name:item.id,
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

      props.ref = item.id;
      this.filters.push(props.ref);

      let Filter = <mui.TextField
          {...props}
          />;
      return <div  style={{'width':'100%'}}>
        {Filter}</div>;
    }
    // text input
    else if('checkbox'==item.type)
    {
      let props = {
        name:item.id,
        label:item.label,

      };

      // checked
      if(item.value==true) {
        props.defaultChecked = true;
      }

      props.ref = item.id;
      this.filters.push(props.ref);

      let Filter = <mui.Checkbox
          {...props}
          />;
      return <div  style={{'width':'100%'}}>
        {Filter}</div>;
    }
    return <span className="badge">{item.label}</span>
  },

  handleSubmit: function(e)
  {
    e.preventDefault();

    let send = {};

    for(let i =0;i<this.filters.length;i++) {
      let filterId = this.filters[i];
      if(this.refs[filterId]) {
        if('function' === typeof this.refs[filterId].isChecked) {
          send[filterId] = this.refs[filterId].isChecked()
        }
        else if('function' === typeof this.refs[filterId].getValue) {
          send[filterId] = this.refs[filterId].getValue()
        }
        else if(this.refs[filterId].state.value) {
          send[filterId] = this.refs[filterId].state.value;
        }
        else if(this.refs[filterId].state.values) {
          send[filterId] = this.refs[filterId].state.values;
        }
      }
      else {
        send[filterId] = null;
      }
    }

    // Hardcoded fields (available to any topic):
    //send.access_private_yn = this.refs.accessSettings.isChecked() == true ? 1 : 0;

    this.props.handleSubmit(send);
  },

});

module.exports = Page;