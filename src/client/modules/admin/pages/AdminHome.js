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
import Component from 'react-pure-render/component';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {mapAdminDispatchToProps, mapStateToProps} from '../../../../common';

import {Paper} from 'material-ui';

@connect(mapStateToProps, mapAdminDispatchToProps)
class AdminHome extends Component {

  render() {
    const classNAme="col-xs-6 col-sm-3";

    const {children, ...props} = this.props;

    if(children) {
      return React.cloneElement(children, props);
    }

    return (
      <div>
          <div className="container-fluid">
            <div className="row">
            <div style={{padding:25}}>
              <h1>Welcome, admin!</h1>
              <p>Select section you'd like to manage:</p>
            </div>
            </div>
            <div className="row">
                  <div className={classNAme}>
                    <div style={{textAlign:'center'}}>
                      <Link to={`/admin/users`}><i className="fa fa-users fa-4x"></i>
                        <br />
                        <h3>Users</h3></Link>
                      <p>Manage Users</p>
                    </div>
                  </div>

                  <div className={classNAme}>
                    <div style={{textAlign:'center'}}>
                      <Link to={`/admin/users`}><i className="fa fa-cog fa-4x"></i>
                        <br />
                        <h3>Config</h3></Link>
                      <p>System Config</p>
                    </div>
                  </div>

                  <div className={classNAme}>
                    <div style={{textAlign:'center'}}>
                      <Link to={`/admin/users`}><i className="fa fa-cogs fa-4x"></i>
                        <br />
                        <h3>Topic Schemes</h3></Link>
                      <p>Group & Type Schemes</p>
                    </div>
                  </div>

                  <div className={classNAme}>
                    <div style={{textAlign:'center'}}>
                      <Link to={`/admin/users`}><i className="fa fa-sitemap fa-4x"></i>
                        <br />
                        <h3>Workspaces</h3></Link>
                      <p>Manage Workspaces</p>
                    </div>
                  </div>



            </div>
          </div>
      </div>
    )
  }
}

export default AdminHome
