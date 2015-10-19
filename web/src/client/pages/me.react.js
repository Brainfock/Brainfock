import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import mui from 'material-ui';
import {ButtonToolbar, Overlay, Popover, Grid, Row, Col} from 'react-bootstrap';

import Logout from '../auth/logout.react';

export default class Me extends Component {

  static propTypes = {
    msg: PropTypes.object,
    users: PropTypes.object
  }

//<div className="me-page">
//<p>
//<FormattedMessage
//defaultMessage={msg.me.welcome}
//id={'msg.me.welcome'}
//values={{email}}
///>
//</p>
//<Logout msg={msg.auth.logout} />
//</div>
  render() {
    const {msg, users: {viewer, viewer: {email}}} = this.props;

    return (
      <DocumentTitle title={msg.me.title}>

        <Grid fluid={true} style={{marginTop:20}}>
          <Row>
            <Col style={{textAlign:'center'}}>
              <mui.Avatar>
                {viewer.username.charAt(0)}
              </mui.Avatar>
              <br />
              <h2>{viewer.username}</h2>
              <h4>{email}</h4>
            </Col>
          </Row>

          <Row>
            <Col md={4} mdOffset={3}>
              <h2>Change password</h2>
              <p>TODO</p>

              <h2>Change email</h2>
              <p>TODO</p>
            </Col>

            <Col md={3} mdOffset={1}>
              <mui.Paper zDepth={2}>
                <mui.CardTitle title="Work in progress"/>
                <mui.CardText>
                  <p>Please note that Brainfock is currently under heavy development, and many features are missing in release.</p>
                  <p>Todo list includes linking third-party accouns (Facebook, github, Twitter, LinkedIn etc.), session management, privacy settings and others. </p>
                </mui.CardText>
              </mui.Paper>
            </Col>

          </Row>
        </Grid>


      </DocumentTitle>
    );
  }

}
