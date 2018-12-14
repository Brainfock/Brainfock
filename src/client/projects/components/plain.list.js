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

export default class ProjectIssues extends Component {

  static propTypes = {
    boards: React.PropTypes.object.isRequired,
    groupKey: React.PropTypes.string.isRequired,
    history: React.PropTypes.object.isRequired,
    listViewItem: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    msg: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    topic_actions: React.PropTypes.object.isRequired,
  }

  constructor(props, props2) {
    super(props);
    this.state = {
      count:0,
      filters:(props.location.query && props.location.query.filter ? props.location.query.filter : null),
      filtersOpen:false,
      loading:true,
      searchQuery:(props.location.query && props.location.query.query ? props.location.query.query : ''),
      showDetails: true,
      disableDetails: true,
    };
  }

  componentDidMount() {
    // pull all topics (projects) from server - this list is filtered by client
    if (process.env.IS_BROWSER === true) {
      const groupKey = this.props.groupKey;
      // load TOPICS of this BOARD
      this.props.topic_actions.count(groupKey, this.state.filters, this.props.params.board_id);
      this.props.topic_actions.find(groupKey, this.state.filters, this.props.params.board_id);
      // load available filters
      this.props.topic_actions.loadFilters(groupKey, {}, this.props.params.board_id);

      if (!this.props.boards.group)
        this.props.topic_actions.loadTopicGroup(groupKey, {}/*, this.props.parentModel*/);
    }
  }

  componentWillUpdate(newProps) {
    if (process.env.IS_BROWSER === true) {
      const groupKey = this.props.groupKey;
      if (newProps.location.query !== this.props.location.query) {
        this.props.topic_actions.count(groupKey, (newProps.location.query.filter || null), this.props.params.board_id);
        this.props.topic_actions.find(groupKey, (newProps.location.query.filter || null), this.props.params.board_id);
      }
    }
  }

  render() {
    const {board, meta, listFilters, newTopic, formFields} = this.props.boards;
    const msg = this.props.msg.topics;

    if (this.props.boards.meta.loading === true) {
      return (
        <h1><Loader /></h1>
      );
    }

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
      // adjust heading to match materia-ui design
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

    const detailsToggleIconClass = this.state.showDetails ? 'fa-info-circle fa-lg fa' : 'fa-info fa-lg fa';

    const addItemForm = (
      <Form
        actions={this.props.actions}
        topic_actions={this.props.topic_actions}
        workspace={this.props.workspace}
        containerStore={this.props.containerTopic}
        formFields={formFields}
        newTopic={newTopic}
        params={this.props.params}
        ref="formView"
        topicGroup={this.props.groupKey}
        />
    );

    if (!this.props.boards.list.size) {
      const EmptyListFallback = this.props.emptyListFallback;
      const {children, ...passProps} = this.props;
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
            display: this.props.disableDetails == true ? 'none' : '',
            height:38,
            padding:9,
            width:38,
          }}
          tooltip="Toggle Details"
          />

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
              onChange={this.searchQueryChanged}
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
          <div className="clearfix col-md-7 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
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

    let rowWidth = this.state.showDetails ? 8 : 12;
    let detialStyle = !this.state.showDetails ? {display:'none'} : {};

    if (this.props.disableDetails === true) {
      return this.renderList();
    }
    return (
      <Grid fluid style={{
        paddingLeft:0,
      }}>
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
        group={this.props.boards.group}
        // whether list should follow link when list item is clicked or just load u details
        followItemOnClick={!this.state.showDetails || !this.state.disableDetails}
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
    if (this.props.boards.viewTopic.loading) {
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
    return (
      <mui.Paper>
        <div style={{padding:'1px 15px 15px 15px'}}>
          <h1>{this.props.boards.viewTopic.summary}</h1>
          {this.props.boards.viewTopic.text}
        </div>
      </mui.Paper>
    );
  }
};