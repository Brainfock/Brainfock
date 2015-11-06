/**
 * Brainfock - Community & Business Management Solution
 * Copyright (c) 2015, Sergii Gamaiunov
 *
 * $$$LICENSE_HEADER$$$
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */

import React from 'react';
import mui from 'material-ui';
import {Tabs, Tab} from 'react-bootstrap';

import PageWithNav from '../components/layout/page-with-nav';
import GeneralSettings from './components/settings-general.js';

export default class Dashboard extends React.Component {

  componentWillMount() {
    this.props.topic_actions.setNewTopic(this.props.boards.board);
  }

  render()
  {
    const {boards:{list, board, group, newTopic}, topic_actions, msg, history} = this.props;

    /*
     <PageWithNav  menuItems={this.menuItems()} {...this.props}>
     Project <b>{board.summary}</b> dashboard is in development
     </PageWithNav>
     */
    return (
      <div className="bfk-browse">
        <GeneralSettings actions={topic_actions}
                         isLoading={newTopic.meta.isSubmitting === true}
                         msg={msg.topics}
                         topic={newTopic}
                         history={this.props.history}
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
