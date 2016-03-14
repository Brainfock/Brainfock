/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';
import mui from 'material-ui';
import {Tabs, Tab} from 'react-bootstrap';

import PageWithNav from '../components/layout/page-with-nav';
import GeneralSettings from './components/settings-general.js';
import Loader from '../components/Loader.js'

export default class Dashboard extends React.Component {

  componentWillMount() {

    //let boardId;
    //if (this.props.boards.board.id) {
    //  boardId = this.props.boards.board.id;
    //} else {
    //  boardId = this.props.params.board_id;
    //}

    if (process.env.IS_BROWSER === true && !this.props.boards.board.id) {
      this.props.topic_actions.loadCurrent(this.props.params.board_id);
    }

    if (this.props.boards.board.id) {

      const formData = this.props.boards.getIn(['forms', 'id', this.props.boards.board.id])

      if (!formData) {
        this.props.topic_actions.makeTopicUpdateFormRecord(this.props.boards.board.id, this.props.boards.board.data.toJS());
      }
    }
  }

  componentWillUpdate() {
    const formData = this.props.boards.getIn(['forms', 'id', this.props.boards.board.id])

    if (!formData && this.props.boards.board.id) {
      this.props.topic_actions.makeTopicUpdateFormRecord(this.props.boards.board.id, this.props.boards.board.toJS());
    }
  }

  componentWillReceiveProps(newProps) {
    if(this.props.boards.board.id !== newProps.boards.board.id && newProps.boards.board.id) {
      this.props.topic_actions.makeTopicUpdateFormRecord(newProps.boards.board.id, newProps.boards.board.toJS());
    }
  }

  render() {

    if (!this.props.boards.board.id) {
      return <Loader />;
    }

    const formData = this.props.boards.getIn(['forms', 'id', this.props.boards.board.id])

    if (!formData) {
      return <Loader />;
    }

    /*
     <PageWithNav  menuItems={this.menuItems()} {...this.props}>
     Project <b>{board.summary}</b> dashboard is in development
     </PageWithNav>
     */
    return (
      <div className="bfk-browse">
        <GeneralSettings actions={this.props.topic_actions}
                         history={this.props.history}
                         isLoading={formData.meta.isSubmitting === true}
                         msg={this.props.msg.topics}
                         topic={formData}
          />
      </div>
    );
  }

  /*renderTabbed()
  {
    const {boards:{list, board, group, newTopic, formFields}, topic_actions, msg, history} = this.props;

    return (
      <div>
        { /!*<mui.Tabs>
          <mui.Tab label="Item One" >
            (Tab content1...)
          </mui.Tab>
          <mui.Tab label="Item Two" >
            (Tab content2...)
          </mui.Tab>
        </mui.Tabs> *!/ }

        <Tabs defaultActiveKey={2} position="left" tabWidth={4} className="bf-tabs">
          <Tab eventKey={1} title="Info">
            <GeneralSettings
              actions={topic_actions}
              isLoading={newTopic.meta.isSubmitting === true}
              msg={msg}
              topic={newTopic}
              history={this.props.history}
              />
          </Tab>
          <Tab eventKey={2} title="More...">More...</Tab>
        </Tabs>
      </div>
    );
  }*/
};
