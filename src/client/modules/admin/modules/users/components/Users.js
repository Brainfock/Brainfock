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
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import CreateUserForm from './create-user-form.js';
import {CircularProgress} from 'material-ui';
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
      open: false,
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

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  renderUserForm() {
    const formData = this.props.users.getIn(['forms', 'id', -1, 'create']);

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose}
        disabled={formData && formData.meta.isSubmitting === true}
        />,
      <FlatButton
        label={(formData && formData.meta.isSubmitting === true ? 'Saving...' : "Submit")}
        primary={true}
        disabled={formData && formData.meta.isSubmitting === true}
        onTouchTap={(e)=>{
                      this.props.actions.saveUserCreateForm(-1, 'create', formData.data)
                      }.bind(this)}
        />,
    ];

    let loader;
    if (formData && formData.meta.isSubmitting === true) {
      loader =  <CircularProgress  size={0.5}/>;
    }
    return (
      <div>
        <Dialog
          title="Create new user account"
          actions={actions}
          modal={true}
          open={this.state.open}
          >
          {loader}
          <CreateUserForm actions={this.props.actions} users={this.props.users} msg={this.props.msg} />

          <br />
        </Dialog>
      </div>
    );
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
              <TableHeaderColumn colSpan="5" tooltip='Super Header' >
                <div className="pull-right">
                  <RaisedButton label="Create User" onTouchTap={this.handleOpen}  /></div>
                <h4 style={{textAlign: 'center'}}>User management</h4>
                {this.renderUserForm()}
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