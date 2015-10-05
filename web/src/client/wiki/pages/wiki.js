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
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
var promisingagent = require('promisingagent');

var React = require('react'),
    Router = require('react-router'),
    {Link, Navigation} = Router,
    mui = require('material-ui-io'),
    Menu = mui.Menu;

var Loader = require('../../components/Loader');

var $ = require('jquery');

class Page extends Component{

  resolveData(props, dispatch)
  {
    var query = [];
    query.push('filter[where][contextEntityId]=0');
    query.push('filter[where][pageUid]='+props.params.uid);
    if(props.users && props.users.viewer) {
      query.push('access_token='+props.users.viewer.authToken)
    }

    const host = props.app.baseUrl;

    return promisingagent.get(`http://${host}/api/wikiPages/findOne?` + query.join('&'))
      .then((response) => {
        props.actions.findWikiSuccess(response.body);
        return response.body
      });
  }

  componentWillReceiveProps(newProps,b)  {
    if(newProps.params.uid && (this.props.params !== newProps.params))
    {
      this.props.actions.findContextPage(0, newProps.params.uid);
    }
  }

  handleClick(a,b,e){
    //;/
    //e.preventDefault();

    if(a.target.nodeName === 'A' && a.target.className.indexOf("WkikLink") == 0) {
      a.preventDefault();
      this.props.history.pushState(null, a.target.getAttribute('href'));

      console.log(a.target.getAttribute('href'));
    }
  }
  render()
  {
    const page = this.props.page || this.props.wiki.viewPage;

    if(page) {
      return (
        <DocumentTitle title={page.pageUid + " — Wiki"}>
        <div className="wiki-wrapper">
          <div className="wiki-page">
            <div className="container-fluid">
              <div className="row">
                <h3>{page.pageUid }
                  <div className="pull-right">
                    <mui.RaisedButton label="Edit" primary={true}  onClick={this.gotoEdit.bind(this)} />
                  </div>
                </h3>
                <div onClick={this.handleClick.bind(this)} dangerouslySetInnerHTML={{__html: page.contentRendered}} />
              </div>
            </div>
          </div>
          <div className="footer">
            <Link to="wiki_page" params={{uid: 'Special:Index'}}>This Wiki Index</Link>
          </div>
        </div>
        </DocumentTitle>
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
    this.props.history.pushState(null, `/wiki/${this.props.wiki.viewPage.pageUid}/edit`);
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
