/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
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
