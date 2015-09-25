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

import { resolve } from "react-resolver";
var promisingagent = require('promisingagent');

var React = require('react'),
    Router = require('react-router'),
    {RouteHandler, Link, Navigation} = Router,
    mui = require('material-ui-io'),
    Menu = mui.Menu;

var Loader = require('../../components/Loader');


var $ = require('jquery');


@resolve("page",
  /**
   * @options {Object} [props] Properties of app
   * @property {Object|Array} params Query params passed from react-router
   * @property {String|Object|Array} initialState Applicaiton's initial state, including `actions`, `intl`, `msg` and others
   */
  function(props)
  {
    //console.log('RESOLVER PROPS:',props);
    var query = [];
    query.push('filter[where][contextEntityId]=0');
    query.push('filter[where][pageUid]='+props.params.uid);
    if(props.users && props.users.viewer) {
      query.push('access_token='+props.users.viewer.authToken)
    }

    // TODO: allow to provide via config e.g. `const host = FULLHOST || 'localhost:3000';`
    const host = 'localhost:3000';

    return promisingagent.get(`http://${host}/api/wikiPages/findOne?` + query.join('&'))
      .then((response) => {
        // this creates infinite loop:
        //if(process.env.IS_BROWSER)
        //  props.actions.findWikiSuccess(response.body);
        return response.body
      });
  })
class Page extends React.Component{

  render()
  {
    if(this.props.page) {
      return (
        <div className="wiki-wrapper">
          <div className="wiki-page">
            <div className="container-fluid">
              <div className="row">
                <h3>{this.props.page.pageUid }
                  <div className="pull-right">
                    { /*<mui.RaisedButton label="Edit" primary={true}  onClick={this.gotoEdit.bind(this)} /> */ }
                    <button primary={true}  onClick={this.gotoEdit.bind(this)}>Edit</button>
                  </div>
                </h3>
                <div dangerouslySetInnerHTML={{__html: this.props.page.contentRendered}} />
              </div>
            </div>
          </div>
          <div className="footer">
            <Link to="wiki_page" params={{uid: 'Special:Index'}}>This Wiki Index</Link>
          </div>
        </div>
      );


    }
    else {
      return <div>
        Empty!
      </div>
    }
    if(!this.state.Page || this.state.Page.loading==true) {
      return <div className="app-content-canvas bfk-browse bfk-projects">
        <div className="page-header clearfix">
          <h2 className="pull-left"><Loader />...</h2>
        </div>

      </div>;
    }
    return (
        <div className="wiki-wrapper">
          <div className="wiki-page">
            <div className="container-fluid">
              <div className="row">
                <h3>{this.state.Page.get('pageUid') }
                  <div className="pull-right">
                    <mui.RaisedButton label="eDIT" primary={true}  onClick={this.gotoEdit.bind(this)} />
                  </div>
                </h3>
                <div dangerouslySetInnerHTML={{__html: this.state.Page.get('contentRendered')}} />
              </div>
            </div>
          </div>
          <div className="footer">
            <Link to="wiki_page" params={{uid: 'Special:Index'}}>This Wiki Index</Link>
          </div>
        </div>
    );
  }

  gotoEdit() {
    this.props.history.pushState(null, `/wiki/${this.props.page.pageUid}/edit`);
  }
  _handleWikiLinks(e)
  {
    e.preventDefault();
    var _link = $(e.target);
    //if(_link.attr('link')) {
    // var linkOptions = $.parseJSON(_link.attr('link'));
    this.transitionTo(_link.attr('href'))
    //if(linkOptions.to) {
    //  this.transitionTo(linkOptions.to,
    //      (linkOptions.params ? linkOptions.params : {}),
    //      (linkOptions.query ? linkOptions.query : {}))
    //}

    //}
  }
};

module.exports = Page;
