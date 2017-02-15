/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {PropTypes} from 'react';
import Component from 'react-addons-pure-render-mixin';
import {HotKeys} from 'react-hotkeys';
import {FormattedRelative, FormattedDate} from 'react-intl';
import {Link} from 'react-router';
import {TextField, RaisedButton} from 'material-ui';

// define hotkeys
const keyMap = {
  saveWiki: 'ctrl+s'
};

export default class Page extends React.Component {

  static propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    wiki: PropTypes.object.isRequired,
  };

  static defaultProps  = {
    wiki: {
      ViewPage: {loading: true}
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      hasBeenSaved: false,
      elapsed: 0
    };
  }

  componentWillMount() {
    this.props.actions.appSetActiveSectionLabel('Wiki');
    if (process.env.IS_BROWSER) {
      if (this.props.params.uid) {
        this.props.actions.findContextPage(0, this.props.params.uid);
      } else {
        this.props.actions.findContextPage(0, 'Index');
      }
    }
  }

  componentDidUpdate() {
    if (!this.timer && this.props.wiki.viewPage.clientSavedOn) {
      this.timer = setInterval(this.tick, (15 * 1000));
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const elapsed = new Date() - this.props.wiki.viewPage.clientSavedOn;
    const inSeconds = Math.round(elapsed / 1000);
    this.setState({
      elapsed: elapsed,
      inSeconds:inSeconds,
    });
  }

  render() {
    const page = this.props.wiki.viewPage;
    let disabled = false;
    if (page.loading === true) {
      disabled = true;
    }

    const handlers = {
      'saveWiki': this.save.bind(this)
    };

    return (
      <HotKeys keyMap={keyMap}>
        <div className="wiki-wrapper">
          <div className="wiki-page">
            <div className="container-fluid">
              <div className="row">
                <h3>{page.pageUid} - edit</h3>
                <HotKeys handlers={handlers}>
                <TextField
                    defaultValue={page.content}
                    multiLine
                    name="content"
                    onChange={this.props.actions.setWikiViewPageField}
                    ref="contentInput"
                    style={{width:'99%'}}
                    value={page.content}
                />
                <RaisedButton
                  disabled={disabled}
                  label="Save"
                  onClick={this.save.bind(this)}
                  primary />
              &nbsp;<RaisedButton
                  disabled={disabled}
                  label="Cancel"
                  onClick={this.cancelAndReturn.bind(this)}
                  primary={false} />
              &nbsp;<RaisedButton disabled={disabled} label="Return" onClick={this.cancelAndReturn.bind(this)} primary={false} />
                  <span style={{textColor:(this.state.hasBeenSaved ? '#8C8C8C' : '#C1C1C1'), paddingLeft:15}}>
                    {this.state.hasBeenSaved && page.clientSavedOn && <FormattedRelative elapsed={this.state.elapsed} value={page.clientSavedOn} />}
                    {!this.state.hasBeenSaved && page.updatedOn &&
                      <span>
                        Last updated on <FormattedDate value={page.updatedOn}/>
                      </span>}
                  </span>
              </HotKeys>
              </div>
            </div>
          </div>
          <div className="footer">
            <Link params={{uid: 'Special:Index'}} to="wiki">This Wiki Index</Link>
          </div>
        </div>
      </HotKeys>
    );
  }

  cancelAndReturn() {
    this.props.history.pushState(null, `/wiki/${this.props.wiki.viewPage.pageUid}`);
  }

  save(e) {
    e.preventDefault();
    const page = this.props.wiki.viewPage;
    const content = this.refs.contentInput.getValue();

    this.props.actions.saveWikiChanges(page.id, {
      content: content,
      contextEntityId:page.contextEntityId,
      pageUid:page.pageUid,
    });
    this.setState({
      hasBeenSaved: true
    });
  }
};
