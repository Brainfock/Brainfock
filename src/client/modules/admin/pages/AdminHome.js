/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
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
                      <Link to={`/admin/schemes`}><i className="fa fa-cogs fa-4x"></i>
                        <br />
                        <h3>Topic Schemes</h3></Link>
                      <p>Group & Type Schemes</p>
                    </div>
                  </div>

                  <div className={classNAme}>
                    <div style={{textAlign:'center'}}>
                      <Link to={`/admin/workspaces`}><i className="fa fa-sitemap fa-4x"></i>
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
