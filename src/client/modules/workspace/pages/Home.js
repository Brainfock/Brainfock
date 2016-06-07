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
import Component from 'react-pure-render/component';
import {Link} from 'react-router';

import fetch from '../../../../common/components/fetch';
import {fetchWorkspaceHomepage} from '../../../../common/workspace/actions';

import Loader from '../../../components/Loader.js';

/**
 * @todo since this is the last route in applicaiton that catches ANY route, this is where we have to handle 404 error
 */
@fetch(fetchWorkspaceHomepage) class WorkspaceHome extends Component {

  static propTypes = {
    actions: React.PropTypes.object,
    children: React.PropTypes.object,
    msg: React.PropTypes.object,
    workspace: React.PropTypes.object,
  }

  componentWillMount() {
    this.props.actions.appSetActiveSectionLabel(this.props.workspace.active.data.name || 'Workspaces');
  }

  render() {

    const workspace = this.props.workspace.active;
    if (workspace.meta.isFetching || !workspace.data.id) {
      return <Loader noLabel/>;
    }

    const {children, ...props} = this.props;
    if (children) {
      return (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div style={{padding:'0 25px'}}>
                <h1>{workspace.data.name}</h1>
              </div>
            </div>
            <div className="row">{React.cloneElement(children, props)} </div>
          </div>
        </div>
      );
    }

    const className = 'col-xs-6 col-sm-3';

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div style={{padding:'0 25px'}}>
              <h1>{workspace.data.name}</h1>
            </div>
          </div>
          <hr/>
          <div className="row">

            <div className={className}>
              <div style={{textAlign:'center'}}>
                <Link to={`/projects/?filter[workspaceId]=${workspace.data.id}`}><i className="fa fa-sitemap fa-4x"></i>
                  <br />

                  <h3>Projects &amp; Initiatives</h3></Link>

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
    );
  }
}

export default WorkspaceHome;
