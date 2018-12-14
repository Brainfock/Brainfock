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
import Component from 'react-pure-render/component';
import {HotKeys} from 'react-hotkeys';
import {FormattedRelative, FormattedDate} from 'react-intl';
import Router, {Link, Navigation} from 'react-router';
import {TextField, RaisedButton} from 'material-ui';

// define hotkeys
const keyMap = {
  saveWiki: 'ctrl+s'
};

export default class Page extends Component{

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
    if (process.env.IS_BROWSER && this.props.boards.board.data.entityId) {
      if (this.props.params.uid) {
        this.props.actions.findContextPage(this.props.boards.board.data.entityId, this.props.params.uid);
      } else {
        this.props.actions.findContextPage(this.props.boards.board.data.entityId, 'Index');
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
                    ref="contentInput"
                    //hintText="Hint Text (MultiLine)"
                    defaultValue={page.content}
                    value={page.content}
                    name="content"
                    multiLine={true}
                    style={{width:"99%"}}
                    onChange={this.props.actions.setWikiViewPageField}
                    />
                  <RaisedButton label="Save" primary={true}  disabled={disabled}  onClick={this.save.bind(this)}  />
                  &nbsp;<RaisedButton label="Cancel" primary={false}  disabled={disabled} onClick={this.cancelAndReturn.bind(this)} />
                  &nbsp;<RaisedButton label="Return" primary={false}  disabled={disabled} onClick={this.cancelAndReturn.bind(this)} />
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
            <Link to={`/${this.props.params.namespace}/${this.props.params.board_id}/wiki/Special:Index`}>This Wiki Index</Link>
            <span className="pull-right"> © Sergii Gamaiunov, powered by <a href="http://brainfock.org">Brainfock</a></span>
          </div>
        </div>
      </HotKeys>
    );
  }

  cancelAndReturn() {
    this.props.history.pushState(null, `/${this.props.params.namespace}/${this.props.params.board_id}/wiki/${this.props.wiki.viewPage.pageUid}`);
  }

  save(e) {
    e.preventDefault();
    const page = this.props.wiki.viewPage;
    const content = this.refs.contentInput.getValue();

    this.props.actions.saveWikiChanges(page.id, {
      content: content,
      contextEntityId:this.props.boards.board.data.entityId,
      //contextEntityId:page.contextEntityId,
      pageUid:page.pageUid,
    });
    this.setState({
      hasBeenSaved: true
    });
  }
};