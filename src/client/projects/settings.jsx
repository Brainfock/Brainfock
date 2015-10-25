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
import React from 'react';
import mui from 'material-ui';
import {Tabs, Tab} from 'react-bootstrap';

import PageWithNav from '../components/layout/page-with-nav';
import GeneralSettings from './components/settings-general.js';

export default class Dashboard extends React.Component{


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
        <GeneralSettings topic={newTopic} actions={topic_actions} msg={msg.topics} />
      </div>
    );
  }

  renderTabbed()
  {
    const {boards:{list, board, group, newTopic, formFields}, topic_actions, msg, history} = this.props;

    /*
     <PageWithNav  menuItems={this.menuItems()} {...this.props}>
     Project <b>{board.summary}</b> dashboard is in development
     </PageWithNav>
     */
    return (
      <div>
        { /*<mui.Tabs>
          <mui.Tab label="Item One" >
            (Tab content1...)
          </mui.Tab>
          <mui.Tab label="Item Two" >
            (Tab content2...)
          </mui.Tab>
        </mui.Tabs> */ }

        <Tabs defaultActiveKey={2} position="left" tabWidth={4} className="bf-tabs">
          <Tab eventKey={1} title="Info">
            <GeneralSettings topic={newTopic} isLoading={formFields.loading==true} actions={topic_actions} msg={msg} />
          </Tab>
          <Tab eventKey={2} title="More...">More...</Tab>
        </Tabs>
      </div>
    );
  }
};
