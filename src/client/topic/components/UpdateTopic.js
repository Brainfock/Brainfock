/**
 * @deprecated file
 */
import React from 'react';
import mui from 'material-ui';
import {Tabs, Tab} from 'react-bootstrap';

import PageWithNav from '../components/layout/page-with-nav';
import GeneralSettings from './components/settings-general.js';
import Loader from '../../components/Loader.js'

export default class Dashboard extends React.Component {

  componentWillMount() {
    if (process.env.IS_BROWSER === true && !this.props.boards.board.id) {
      this.props.topic_actions.loadCurrent(this.props.params.board_id);
    }

    if (!this.props.formData && this.props.boards.board.id) {
      this.props.topic_actions.makeTopicUpdateFormRecord(this.props.boards.board.id, {...this.props.boards.board});
  }
}

render()
{
  const {boards:{list, board, group, newTopic}, topic_actions, msg, history} = this.props;

  if (!this.props.boards.board.id) {
    return <Loader />
  }

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
