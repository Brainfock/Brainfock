/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Component from 'react-addons-pure-render-mixin';
import DocumentTitle from '../../components/Title';
import React from 'react';
import {Link} from 'react-router';
import mui from 'material-ui';
import fetch from '../../../common/components/fetch';
import {fetchContextPage} from '../../../common/wiki/actions';

@fetch(fetchContextPage)
class Page extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object,
    children: React.PropTypes.object,
    history: React.PropTypes.object,
    msg: React.PropTypes.object,
    page: React.PropTypes.object,
    params: React.PropTypes.object,
    wiki: React.PropTypes.object,
  }

  componentWillMount() {
    this.props.actions.appSetActiveSectionLabel('Wiki');
    if (this.props.params.uid
      && (!this.props.wiki.viewPage.pageUid || this.props.wiki.viewPage.pageUid !== this.props.params.uid)) {
      this.props.actions.findContextPage(0, this.props.params.uid);
    }
  }

  componentWillReceiveProps(newProps, b)  {
    if (newProps.params.uid && (this.props.params !== newProps.params)) {
      this.props.actions.findContextPage(0, newProps.params.uid);
    }
  }

  /**
   * handle clicks on elements in page's text & navigate internal links with app router
   * @param a
   */
  handleClick(a) {
    if (a.target.nodeName === 'A' && a.target.className.indexOf('WkikLink') === 0) {
      a.preventDefault();
      this.props.history.pushState(null, a.target.getAttribute('href'));
    }
  }

  render() {
    const page = this.props.page || this.props.wiki.viewPage;

    //if(!this.state.Page || this.state.Page.loading==true) {
    //  return <div className="app-content-canvas bfk-browse bfk-projects">
    //    <div className="page-header clearfix">
    //      <h2 className="pull-left"><Loader />...</h2>
    //    </div>
    //
    //  </div>;
    //}

    if (page) {
      return (
        <DocumentTitle title={page.pageUid + ' — Wiki'}>
        <div className="wiki-wrapper">
          <div className="wiki-page">
            <div className="container-fluid">
              <div className="row">
                <h3>{page.pageUid }
                  <div className="pull-right">
                    <mui.RaisedButton label="Edit" onClick={this.gotoEdit.bind(this)}  primary />
                  </div>
                </h3>
                <div dangerouslySetInnerHTML={{__html: page.contentRendered}} onClick={this.handleClick.bind(this)} />
              </div>
            </div>
          </div>
          <div className="footer">
            <Link to="/wiki/Special:Index">This Wiki Index</Link>
            <span className="pull-right"> © Sergii Gamaiunov, powered by <a href="http://brainfock.org">Brainfock</a></span>
          </div>
        </div>
        </DocumentTitle>
      );
    } else {
      return (<div>
        Empty!
      </div>);
    }
  }

  gotoEdit() {
    this.props.history.pushState(null, `/wiki/${this.props.wiki.viewPage.pageUid}/edit`);
  }
}

export default Page;

