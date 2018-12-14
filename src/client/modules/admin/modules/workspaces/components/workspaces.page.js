/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import {Link} from 'react-router'
import {Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter, Styles} from 'material-ui';
const {Spacing, Colors} = Styles;

import Loader from '../../../../../components/Loader';
import UserAvatar from '../../../../../users/components/Avatar';
import Component from 'react-pure-render/component';

import {Utils} from 'material-ui';
const Events = Utils.Events;

class Users extends Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      displayRowCheckbox: false,
      tableHeight: `300px`,
      deviceHeight: 300,
    };
  }
  componentWillMount() {
    if (!this.props.users.list || !this.props.users.list.size)
      this.props.actions.findWorkspaces('filter[include][owner]');
  }

  componentDidMount() {
    this._unbindResizeWidth();
    this._updateDeviceWidth.bind(this)();
    if (!this.manuallyBindResize) this._bindResizeWidth();
  }
  componentWillUnmount() {
    this._unbindResizeWidth();
  }
  _updateDeviceWidth() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let tableHeight = height
        - this.context.muiTheme.appBar.height
        - (this.context.muiTheme.tableHeaderColumn.height * 4)
      ;

    this.setState({
      deviceWidth: width,
      deviceHeight: height,
      tableHeight: `${tableHeight}px`,
    });
  }
  _bindResizeWidth() {
    Events.on(window, 'resize', this._updateDeviceWidth.bind(this));
  }
  _unbindResizeWidth() {
    Events.off(window, 'resize', this._updateDeviceWidth.bind(this));
  }

  render() {

    const {children, ...props} = this.props;

    if(children) {
      return React.cloneElement(children, props);
    }

    const {workspace: {list, listMeta:{isFetching, count}}} = this.props;
    const msg = this.props.msg.users;

    if (isFetching === true) return (
      <h1><Loader /></h1>
    );

    // TODO: add nice empty list component
    if (!list.size) return (
      <p>{msg.emptyList}</p>
    );

    return (
      <Table
        height={this.state.tableHeight}
        fixedHeader={this.state.fixedHeader}
        fixedFooter={this.state.fixedFooter}
        selectable={this.state.selectable}
        multiSelectable={this.state.multiSelectable}
        onRowSelection={this._onRowSelection}>
        <TableHeader enableSelectAll={this.state.enableSelectAll} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn colSpan="4" tooltip='Super Header' style={{textAlign: 'center'}}>
              <h4>Workspaces</h4>
            </TableHeaderColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn tooltip={msg.list.column.hint.id}>ID</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
            <TableHeaderColumn tooltip={msg.list.column.hint.name}>{msg.list.column.label.name}</TableHeaderColumn>
            <TableHeaderColumn tooltip={msg.list.column.hint.owner}>{msg.list.column.label.owner}</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={this.state.deselectOnClickaway}
          showRowHover={this.state.showRowHover}
          displayRowCheckbox={this.state.displayRowCheckbox}
          stripedRows={this.state.stripedRows}>
          {list.map(todo =>
              <TableRow selected={false} selectable={false}>
                <TableRowColumn>{todo.id}</TableRowColumn>
                <TableRowColumn><UserAvatar user={todo}/></TableRowColumn>
                <TableRowColumn><Link to={`/${todo.data.namespace}`}>{todo.data.name}</Link></TableRowColumn>
                <TableRowColumn><span className="label label-primary">{todo.data.owner && todo.data.owner.username}</span></TableRowColumn>
              </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableRowColumn colSpan="4" style={{textAlign: 'center'}}>
              Super Footer
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

export default Users