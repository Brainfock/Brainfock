/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov,  All rights reserved.
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
import React from 'react';
import mui from 'material-ui';
import Component from 'react-pure-render/component';
import {FormattedMessage} from 'react-intl';
import {Grid, Row, Col, Affix} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';

import Loader from '../../components/Loader';
import ListActions from '../../components/UIListActions';
import Form from '../../topic/components/create-topic-form';

import ListView from '../../boards/boards.react';
import ListViewItem from './issues-list-item';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Filters from '../../components/UISimpleFilters';
import FetchActionError from '../../components/FetchActionError';

export default class ProjectIssues extends Component {

  static propTypes = {
    boards: React.PropTypes.object.isRequired,

    // "Context" of this topic; a link to {Topic} by contextTopicId.
    // Must be `null` for root views (e.g. list all projects, boards etc.)
    containerTopic: React.PropTypes.any,
    // React Component to render in details section
    detailsComponent: React.PropTypes.element,
    // React Component to render is list is empty
    emptyListFallback: React.PropTypes.element,
    groupKey: React.PropTypes.string.isRequired,
    // react-router history
    history: React.PropTypes.object.isRequired,
    listViewItem: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    msg: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    topic_actions: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    location: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      count:0,
      filters:(props.location.query && props.location.query.filter ? props.location.query.filter : null),
      filtersOpen:false,
      searchQuery:(props.location.query && props.location.query.query ? props.location.query.query : ''),
      showDetails: true,
      disableDetails: false
    };
  }

  fetchData() {

    if (process.env.IS_BROWSER === true) { // or get an infinite loop

      const groupKey = this.props.groupKey;
      this.props.topic_actions.count(groupKey, this.state.filters, this.props.params.board_id, this.props.params.namespace);
      this.props.topic_actions.find(groupKey, this.state.filters, this.props.params.board_id, this.props.params.namespace);
      this.props.topic_actions.loadFilters(groupKey, {}, this.props.params.board_id);

      if (!this.props.boards.group || this.props.boards.group.groupKey !== groupKey) {
        this.props.topic_actions.loadTopicGroup(groupKey);
      }
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUpdate(newProps) {

    if (process.env.IS_BROWSER === true) {

      if (`${newProps.location.search}` !== `${this.props.location.search}`) {

        let query = {};
        if (this.state.searchQuery) {

          const queryString = encodeURI('%' + newProps.location.query.query + '%');
          query.summary = {like: queryString};
        }
        let filter = Object.assign(query, newProps.location.query.filter);
        this.props.topic_actions.count(this.props.groupKey, filter, this.props.params.board_id, this.props.params.namespace);
        this.props.topic_actions.find(this.props.groupKey, filter, this.props.params.board_id, this.props.params.namespace);
      }
    }
  }

  render() {

    const {board, meta, listFilters, newTopic, formFields} = this.props.boards;
    const msg = this.props.msg.topics;

    let filterToggleButton = (
      <mui.IconButton
        iconClassName="fa fa-filter fa-lg"
        onClick={this.toggleFilters.bind(this)}
        tooltip="Filter"
        />
    );

    let filterStyles = {
      margin: '0 -15px',
      padding: '10px 15px'
    };

    if (this.state.filtersOpen === false) {
      filterStyles.display = 'none';
    }

    const titleMsg = (
      <h3 style={{
        // adjust heading to match material-ui design
        // TODO: use variables form theme, don't hadrcode styles in here
        margin: 0,
        padding: '24px 24px 0px',
        color: 'rgba(0, 0, 0, 0.870588)',
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: 400
      }}>
        <FormattedMessage
          defaultMessage={msg.form.create.title}
          id={'msg.form.create.title'}
          values={{type:this.props.boards.group.name}}
          />
      </h3>
    );

    // prevent all children components to make unnecessary fetch requests to gather irrelevant data
    if (this.props.containerTopic !== null && !this.props.containerTopic.id) {
      return <h1><Loader /></h1>
    }

    // don't show filter toggle button when details are disabled
    const detailsToggleIconClass = this.state.showDetails ? 'fa-info-circle fa-lg fa' : 'fa-info fa-lg fa';

    const registryRootId = this.props.containerTopic && this.props.containerTopic.id || 99999999;
    const formCid = this.props.boards.formsRegistry.getIn([registryRootId, this.props.groupKey]);
    const formData = this.props.boards.forms.getIn(['cid', formCid]);

    const addItemForm = (
      <Form
        actions={this.props.topic_actions}
        containerStore={this.props.containerTopic}
        formData={formData}
        formFields={formFields}
        form={this.props.boards.form}
        newTopic={newTopic}
        params={this.props.params}
        topicGroup={this.props.groupKey}
        />
    );

    if (!this.props.boards.list.size
        // don't show empty list fallback if being loaded - e.g., filters were applied
      && !this.props.boards.meta.isFetching && !this.props.boards.meta.error
        // dont show empty fallback when filters or search query are not empty - user probably just searcher for something that isn't there
      && (!this.state.searchQuery && !this.state.filters)) {
      const EmptyListFallback = this.props.emptyListFallback;
      const {children, ...passProps} = this.props; // extract children to avoid redux data corrupt & loop infinitely
      return <EmptyListFallback {...passProps} form={addItemForm}/>;
    }

    const summary = meta.count > 0
      ? <FormattedMessage
      defaultMessage={msg.list.countItems}
      values={{countItems:meta.count}}
      />
      : '';

    const ListActionsRendered = (
      <div className="pull-right">
        {summary}
        <mui.IconButton
          iconClassName={detailsToggleIconClass}
          onClick={e => this.setState({
            showDetails: !this.state.showDetails,
            target: e.target
          })}
          style={{
            display: this.props.disableDetails === true ? 'none' : '',
            height:38,
            padding:9,
            width:38
          }}
          tooltip="Toggle Details"   />

        <ListActions
          addItemForm={addItemForm}
          BUTTON_ACTION_LABEL={msg.list.addNew.button}
          formFields={formFields}
          msg={msg}
          TITLE={titleMsg}
          />
      </div>
    );

    const iconButtonElement = <mui.IconButton iconClassName="fa fa-list-alt" tooltip="Filter presets"/>;
    const content = this.renderListContent();

    return (
      <DocumentTitle title={this.props.boards.board.summary + ' - ' + this.props.boards.group.name}>
        <div className="bfk-browse">
          <div className="page-header clearfix">

            {ListActionsRendered}

            <mui.TextField
              defaultValue={this.state.searchQuery}
              hintText={this.state.searchQuery ? null : 'Search in text'}
              onChange={this.searchQueryChanged.bind(this)}
              onKeyDown={::this.onKeyDown}
              ref="searchbox"
              />

            {filterToggleButton}

            <Filters
              actions={this.props.topic_actions}
              containerStore={board}
              filters={listFilters}
              header={
               <div className="pull-left">
                 <mui.IconMenu iconButtonElement={iconButtonElement}>
                   <MenuItem onClick={
                    function() {
                      this.props.history.pushState(null, `/${this.props.params.namespace}/${this.props.params.board_id}/issues?filter[wfStatus][]=open`);
                    }.bind(this)
                   } primaryText="All open"/>
                   <MenuItem onClick={
                    function() {
                      this.props.history.pushState(null, `/${this.props.params.namespace}/${this.props.params.board_id}/issues?filter[wfStatus][]=closed`);
                    }.bind(this)
                   } primaryText="All closed"/>
                   <MenuItem onClick={
                    function() {
                      this.props.history.pushState(null, `/${this.props.params.namespace}/${this.props.params.board_id}/issues?filter[wfStage][]=Backlog`);
                    }.bind(this)
                   } primaryText="Backlog"/>
                 </mui.IconMenu>
               </div>
             }
              onApply={this.onApplyFilters}
              preselected={this.props.location.query}
              ref="filters"
              style={filterStyles}
              />
          </div>
          <div className="clearfix" style={{position:'relative'}}>
            {this.props.boards.meta.error &&
            <FetchActionError
              msg={this.props.msg}
              meta={this.props.boards.meta}
              handleRetry={this.fetchData.bind(this)}
              />}
            {content}
          </div>
        </div>
      </DocumentTitle>
    );
  }

  toggleFilters() {

    let setVisibility = !this.state.filtersOpen;
    this.setState({filtersOpen: setVisibility});
  }

  renderListContent() {

    // show state of loading list
    if (this.props.boards.meta.isFetching === true &&
      (!this.props.boards.list.size || this.props.boards.meta.groupKey != this.props.groupKey)) {
      return (
        <h1><Loader asGlobal/></h1>
      );
    }
    // having empty list at this point meant there was an error during fetch
    if (!this.props.boards.list.size) {
      return null;
    }

    let rowWidth = this.state.showDetails ? 8 : 12;
    let detialStyle = !this.state.showDetails ? {display:'none'} : {};

    if (this.props.disableDetails === true) {
      return (
        <div>
          {this.props.boards.meta.isFetching === true &&
          <div style={{position:'absolute',width:'100%'}}><Loader noLabel/></div>}
          {this.renderList()}
        </div>
      );
    }
    return (
      <Grid fluid style={{
        paddingLeft:0,
      }}>
        {this.props.boards.meta.isFetching === true &&
        <div style={{position:'absolute',width:'100%'}}><Loader noLabel/></div>}
        <Row>
          <Col md={rowWidth}>
            {this.renderList()}
          </Col>
          <Col md={4} style={detialStyle}>
            <Affix
              className="bs-docs-sidebar hidden-print"
              offsetBottom={64}
              offsetTop={64}
              role="complementary"
              >
              {this.renderDetails()}
            </Affix>
          </Col>
        </Row>
      </Grid>
    );
  }

  renderList() {

    const groupKey = this.props.groupKey;
    return (
      <ListView
        actions={this.props.topic_actions}
        followItemOnClick={!this.state.showDetails || this.state.disableDetails}
        group={this.props.boards.group}
        history={this.props.history}
        itemComponent={this.props.listViewItem}
        list={this.props.boards.list}
        msg={this.props.msg.todos}
        params={this.props.params}
        topicGroupKey={groupKey}
        viewTopic={this.props.boards.viewTopic}
        />
    );
  }

  renderDetails() {

    if (this.props.boards.viewTopic.isFetching === true) {
      return (
        <div style={{width:'100%', textAlign:'center'}}>
          <h1><Loader /></h1>
        </div>
      );
    }
    if (!this.props.boards.viewTopic.id) {
      return (
        <mui.Paper>
          <div style={{padding:'5px 15px 15px 15px'}}>
            <h3>Select item in list to see details.</h3>
            <p>You can hide this panel by clicking `i` button.</p>
          </div>
        </mui.Paper>
      );
    }

    if (this.props.detailsComponent) {
      const Details = this.props.detailsComponent;
      return <Details
        topic_actions={this.props.topic_actions}
        io={this.props.io}
        actions={this.props.actions}
        onDeleted={()=>{
          // TODO: close details panel?
        }.bind(this)}
        topic={this.props.boards.viewTopic}
        />
    } else {
      return (
        <mui.Paper>
          <div style={{padding:'1px 15px 15px 15px'}}>
            <h1>{this.props.boards.viewTopic.summary}</h1>
            {this.props.boards.viewTopic.text}
          </div>
        </mui.Paper>
      );
    }
  }

  timer = null;

  searchQueryChanged(e) {
    // TODO: call action for reduces to get latest value
    clearTimeout(this.timer);
    this.timer = setTimeout(this.applySearchQuery.bind(this), 400);
  }

  applySearchQuery() {

    const newValue = this.refs.searchbox.getValue();

    //let currentQuery = Object.assign({}, this.props.location.query);
    let currentQuery = this.props.location.query;

    if (newValue) {
      currentQuery['query'] = newValue;
    } else {
      currentQuery['query'] = ''; // reset query, e.g. "show all"
    }

    this.setState({searchQuery: newValue});
    this.props.history.pushState(null, this.props.location.pathname, currentQuery);
  }

  onKeyDown(e) {
    if (e.key === 'Enter')
      this.applySearchQuery();
  }
};