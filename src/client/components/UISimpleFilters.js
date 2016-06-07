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
//import {Button} from 'react-bootstrap';
import Select from 'react-select';

import RemoteSelectField from './form/RemoteSelectField';
require('react-select/less/select.less');

/**
 * Renders filters based on props.filters configuration
 * Does not perform any filtering
 *
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
let UISimpleFilters = React.createClass({
  propTypes: {
    actions: React.PropTypes.any,
    filters: React.PropTypes.any,
    header: React.PropTypes.element,
    onApply: React.PropTypes.any,
    style: React.PropTypes.object,
  },
  getInitialState: function() {
    return {

    };
  },

  getDefaultProps() {
    return {
      filters: [
      ],
      preselected:{},
      onApply: function(selectedFilters) {
      },
      header:null,
    };
  },

  applyFilters: function() {
    let send = {};

    for (let i = 0; i < this.filters.length; i++) {
      let filterId = this.filters[i];
      if (this.refs[filterId]) {
        send[filterId] = this.refs[filterId].state.values;
        //console.log('filter ' +filterId + ' value:',this.refs[filterId].state.values)
      } else {
        send[filterId] = null;
      }
    }

    this.props.onApply(send);

  },

  onFilterChange: function(a, b, c) {
  },

  /**
   * @todo implement master-detail view (optional)
   * @returns {*}
   */
  render() {
    const {filters} = this.props;
    let styles = this.props.style || {};
    return (
      <div className="clearfix" style={styles}>
        {this.props.header}
        {filters.map(filter =>
          this.renderItem(filter)
        )}
      </div>
    );
    //return (<div style={styles} className="clearfix">
    //  {this.props.filters.map(this.renderItem)}
    //   <Button onClick={this.applyFilters}>Apply</Button>
    //  </div>);
  },
  filters:[],
  renderItem(item) {
    if (item.type === 'select' || item.type === 'multiselect') {
      let props = {
        name:item.id,
        placeholder:item.label,
        options:item.options,
      };
      if (item.type === 'multiselect') {
        props.multi = true;
      }
      props.ref = item.id;
      this.filters.push(props.ref);

      // this is a must - `react-select` assumes this property to be at least empty string
      props.value = '';

      let Filter;
      if (item.endpoint) {
        Filter = (<RemoteSelectField
          {...props}
          endpoint={item.endpoint}
          onChange={this.onFilterChange}
          />);
      } else {
        Filter = (<Select
          {...props}
          onChange={this.onFilterChange}
          />);
      }

      return (<div className="pull-left" style={{
        minWidth:'150px',
        maxWidth:'390px',
      }}>
        {Filter}</div>);
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

module.exports = UISimpleFilters; // eslint-disable-line no-undef
