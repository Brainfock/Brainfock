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
var React = require('react'),
    bs = require('react-bootstrap'),
    {Button} = bs;

import Select from 'react-select';
import RemoteSelectField from './form/RemoteSelectField';
var mui = require('material-ui');

require('react-select/less/select.less');


/**
 * Renders filters based on props.filters configuration
 * Does not perform any filtering
 *
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
var UISimpleFilters = React.createClass({

  getInitialState: function() {
    return {

    };
  },

  getDefaultProps: function()
  {
    return {
      filters: [
      ],
      preselected:{},
      onApply: function(selectedFilters) {
      },
      header:null,
    }
  },

  applyFilters: function() {

    let send = {};

    for(let i =0;i<this.filters.length;i++) {
      let filterId = this.filters[i];
      if(this.refs[filterId]) {
        send[filterId] = this.refs[filterId].state.values;
        //console.log('filter ' +filterId + ' value:',this.refs[filterId].state.values)
      }
      else {
        send[filterId] = null;
      }
    }

    this.props.onApply(send)

  },
  onFilterChange: function(a,b,c) {
    //console.log('onFilterChange')
    //console.log('a',a)
    //console.log('b',b)
  },

  /**
   * @todo implement master-detail view (optional)
   * @returns {*}
   */
  render: function()
  {
    const {filters, actions} = this.props;
    let styles = this.props.style || {};
    return (
      <div style={styles} className="clearfix">
        {this.props.header}
        {filters.map(filter =>
          this.renderItem(filter)
        )}
      </div>
    );


    return <div style={styles} className="clearfix">
      {this.props.filters.map(this.renderItem)}
       <Button onClick={this.applyFilters}>Apply</Button>
      </div>
  },
  filters:[],
  renderItem:function(item)
  {
    if(item.type == 'select' || item.type == 'multiselect') {
      let props = {
        name:item.id,
        placeholder:item.label,
        options:item.options,
      };
      if(item.type == 'multiselect') {
        props.multi = true;
      }
      props.ref = item.id;
      this.filters.push(props.ref);

      // this is a must - `react-select` assumes this property to be at least empty string
      props.value='';

      let Filter;
      if(item.endpoint) {
        Filter = <RemoteSelectField
          {...props}
          endpoint={item.endpoint}
          onChange={this.onFilterChange}
          />;
      }
      else {
        Filter = <Select
          {...props}
          onChange={this.onFilterChange}
          />;
      }

      return <div className="pull-left" style={{
        minWidth:'150px',
        maxWidth:'390px',
        }}>
        {Filter}</div>;
    }

    // TODO: implement
    //if(item.type == 'text' ) {
    //  let props = {
    //    name:item.id,
    //    options:item.options,
    //  };
    //
    //  props.ref = item.id;
    //  this.filters.push(props.ref);
    //
    //  if(this.props.preselected && this.props.preselected[item.id])
    //    props.value = this.props.preselected[item.id];
    //
    //  var Filter = <mui.TextField
    //      {...props}
    //      onChange={this.onFilterChange}
    //      />;
    //  return <div className="pull-left" style={{'max-width':'400px'}}>
    //    {Filter}</div>;
    //}

    //return <span className="badge">{item.label}</span>
  },
});

module.exports=UISimpleFilters;