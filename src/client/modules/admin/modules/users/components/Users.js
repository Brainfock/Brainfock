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
      this.props.actions.findUsers('filter[include][roles]');
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

    const {users: {list, listMeta:{isFetching, count}}} = this.props;
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
              <TableHeaderColumn colSpan="5" tooltip='Super Header' style={{textAlign: 'center'}}>
                <h4>User management</h4>
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip={msg.list.column.hint.id}>ID</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
              <TableHeaderColumn tooltip={msg.list.column.hint.name}>{msg.list.column.label.name}</TableHeaderColumn>
              <TableHeaderColumn tooltip={msg.list.column.hint.email}>{msg.list.column.label.email}</TableHeaderColumn>
              <TableHeaderColumn tooltip={msg.list.column.hint.role}>{msg.list.column.label.role}</TableHeaderColumn>
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
                <TableRowColumn><Link to={`/admin/users/${todo.id}`}>{todo.username}</Link></TableRowColumn>
                <TableRowColumn>{todo.email}</TableRowColumn>
                <TableRowColumn>
                {todo.roles && todo.roles.map(role =>
                  <span className="label label-primary">{role.name}</span>
                )}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn colSpan="5" style={{textAlign: 'center'}}>
                Super Footer
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
    );
  }
}

export default Users