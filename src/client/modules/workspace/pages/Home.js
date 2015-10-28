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
import {Paper} from 'material-ui';

import fetch from '../../../../common/components/fetch';
import {fetchWorkspaceHomepage} from '../../../../common/workspace/actions';

import Loader from '../../../components/Loader.js';

/**
 * @todo since this is the last route in applicaiton that catches ANY route, this is where we have to handle 404 error
 */
@fetch(fetchWorkspaceHomepage) class WorkspaceHome extends Component {

  render() {

    const {children, ...props} = this.props;
    if (children) {
      return React.cloneElement(children, props);
    }

    const className = "col-xs-6 col-sm-3";

    const workspace = this.props.workspace.active;

    if (workspace.meta.isFetching || !workspace.data.id) {
      return <Loader noLabel/>
    }

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div style={{padding:'0 25px'}}>
              <h1>{workspace.data.name}</h1>
            </div>
          </div>
          <div className="row">

            <div className={className}>
              <div style={{textAlign:'center'}}>
                <Link to={`/projects/?filter[workspaceId]=${workspace.data.id}`}><i className="fa fa-sitemap fa-4x"></i>
                  <br />

                  <h3>Projects & Initiatives</h3></Link>

                <p>Manage your business</p>
              </div>
            </div>

            <div className={className}>
              <div style={{textAlign:'center'}}>
                <Link to={`/workspaces/${workspace.data.namespace}/members`}><i className="fa fa-users fa-4x"></i>
                  <br />

                  <h3>Members</h3></Link>

                <p>Review Access Settings</p>
              </div>
            </div>

            <div className={className}>
              <div style={{textAlign:'center'}}>
                <Link to={`/workspaces/${workspace.data.namespace}/settings`}><i className="fa fa-cog fa-4x"></i>
                  <br />

                  <h3>Config</h3></Link>

                <p>System Config</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default WorkspaceHome
