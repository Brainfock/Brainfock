/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
var React = require('react'),
  Router = require('react-router'),
  {Link, Navigation} = Router,
  mui = require('material-ui'),
  Menu = mui.Menu;

import fetch from '../../../common/components/fetch';

import Loader from '../../components/Loader';

import {fetchContextPage} from '../../../common/wiki/actions';

@fetch(fetchContextPage)
class Page extends Component {

  componentWillMount(props)  {
    if (this.props.params.uid
      && (!this.props.wiki.viewPage.pageUid || this.props.wiki.viewPage.pageUid !== this.props.params.uid)) {
      this.props.actions.findContextPage(0, this.props.params.uid);
    }
  }

  componentWillReceiveProps(newProps,b)  {
    if(newProps.params.uid && (this.props.params !== newProps.params))
    {
      this.props.actions.findContextPage(0, newProps.params.uid);
    }
  }

  /**
   * handle clicks on elements in page's text & navigate internal links with app router
   * @param a
   */
  handleClick(a){
    if(a.target.nodeName === 'A' && a.target.className.indexOf("WkikLink") == 0) {
      a.preventDefault();
      this.props.history.pushState(null, a.target.getAttribute('href'));
    }
  }

  render()
  {
    const page = this.props.page || this.props.wiki.viewPage;

    //if(!this.state.Page || this.state.Page.loading==true) {
    //  return <div className="app-content-canvas bfk-browse bfk-projects">
    //    <div className="page-header clearfix">
    //      <h2 className="pull-left"><Loader />...</h2>
    //    </div>
    //
    //  </div>;
    //}

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
            <Link to="/wiki/Special:Index">This Wiki Index</Link>
            <span className="pull-right"> © Sergii Gamaiunov, powered by <a href="http://brainfock.org">Brainfock</a></span>
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
  }

  gotoEdit() {
    this.props.history.pushState(null, `/wiki/${this.props.wiki.viewPage.pageUid}/edit`);
  }
};

module.exports = Page;
