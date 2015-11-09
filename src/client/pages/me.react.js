import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import mui, {TextField, RaisedButton} from 'material-ui';
import {ButtonToolbar, Overlay, Popover, Grid, Row, Col} from 'react-bootstrap';

import Logout from '../auth/logout.react';
import Loader from '../components/Loader.js';

export default class Me extends Component {

  static propTypes = {
    msg: PropTypes.object,
    users: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      formStep: {
        email: 1
      }
    }
  }

  componentWillMount() {

    const {users: {viewer}, actions} = this.props;

    if (!this.props.users.getIn(['forms', 'id', viewer.id, 'password'])) {
      actions.makeUserUpdateFormRecord(viewer.id, 'password');
    }
    if (!this.props.users.getIn(['forms', 'id', viewer.id, 'email'])) {
      actions.makeUserUpdateFormRecord(viewer.id, 'email');
    }
  }

  renderEmailChangeForm() {
    const viewer = this.props.users.viewer;
    const emailForm = this.props.users.getIn(['forms', 'id', viewer.id, 'email']);

    if (this.state.formStep.email === 1) {
      return (
        <span>
        <TextField
          placeholder='New Email'
          name='newEmail'
          fullWidth
          value={emailForm.data.newEmail}
          errorText={emailForm.meta.errors.get('newEmail') || null}
          onChange={(e)=>{
                    this.props.actions.setUserUpdateFormField(e, viewer.id, 'email')
                    }.bind(this)}
          />
        <br />
        <TextField
          placeholder='Your current password'
          name='currentPassword'
          type='password'
          fullWidth
          value={emailForm.data.currentPassword}
          errorText={emailForm.meta.errors.get('currentPassword') || null}
          onChange={(e)=>{
                    this.props.actions.setUserUpdateFormField(e, viewer.id, 'email')
                    }.bind(this)}
          />
        <br />
        <RaisedButton type="submit" label="Next" primary disabled={!(emailForm.data.newEmail && emailForm.data.currentPassword)} />
        </span>
      );

    } else {
      return (
        <span>
          <p>You will receive a link to confirm your new email.</p>
        <br />
        <RaisedButton type="submit" label="Send confirmation link" primary disabled={!(emailForm.data.newEmail && emailForm.data.currentPassword)} />
          <span> </span>
        <RaisedButton onClick={(e)=>{this.resetFormStep(e, 'email')}} label="Cancel" />
      </span>
          );
    }
  }
  render() {

    const {msg, users: {viewer, viewer: {email}}, actions} = this.props;

    const passwordForm = this.props.users.getIn(['forms', 'id', viewer.id, 'password']);
    const emailForm = this.props.users.getIn(['forms', 'id', viewer.id, 'email']);


    /*
    create component that wraps form errors processing, data handling
    it should use formFactory if rom schema is provided
    if not - user can provide whole form rendered
     */

    if (!passwordForm || !emailForm) {
      return <Loader />;
    }
    return (
      <DocumentTitle title={msg.me.title}>

        <Grid fluid={true} style={{marginTop:20}}>
          <Row style={{marginBottom:20}}>
            <Col style={{textAlign:'center'}}>
              <mui.Avatar>
                {viewer.username.charAt(0)}
              </mui.Avatar>
              <br />
              <h1>{viewer.username}</h1>
              <h4>{email}</h4>
            </Col>
          </Row>

          <Row>
            <Col md={4} mdOffset={4} sm={6} smOffset={3}>

              { /*<h3>Security & Email</h3> */ }

              <h4>Change password</h4>
              <form onSubmit={(e)=>{this.handleFormSubmit(e, 'password')}}>


                <TextField
                  placeholder='New Password'
                  name='password'
                  type='password'
                  fullWidth
                  value={passwordForm.data.password}
                  errorText={passwordForm.meta.errors.get('password') || null}
                  onChange={(e)=>{
                    this.props.actions.setUserUpdateFormField(e, viewer.id, 'password')
                    }.bind(this)}
                  />
                <br />
                { /*<TextField
                  placeholder='Type new pasword again'
                  name='confirmPassword'
                  type='password'
                  value={passwordForm.data.confirmPassword}
                  errorText={passwordForm.meta.errors.get('confirmPassword') || null}
                  onChange={(e)=>{
                    this.props.actions.setUserUpdateFormField(e, viewer.id, 'password')
                    }.bind(this)}
                  />
                <br />
                <TextField
                  placeholder='Your current password'
                  name='currentPassword'
                  type='password'
                  value={passwordForm.data.currentPassword}
                  errorText={passwordForm.meta.errors.get('currentPassword') || null}
                  onChange={(e)=>{
                    this.props.actions.setUserUpdateFormField(e, viewer.id, 'password')
                    }.bind(this)}
                  />
                <br /> */ }
                <RaisedButton type="submit" label="Save" primary disabled={!(passwordForm.data.password && passwordForm.data.confirmPassword && passwordForm.data.currentPassword)} />
              </form>

              <br />
              <br />

              <h4>Change email</h4>

              <form onSubmit={(e)=>{this.nextFormStep(e, 'email')}}>
                {this.renderEmailChangeForm()}
              </form>

            </Col>

            { /*
            <Col md={3} mdOffset={1} sm={6} smOffset={3}>
              <mui.Paper zDepth={1}>
                <mui.CardTitle title="Work in progress"/>
                <mui.CardText>
                  <p>Please note that Brainfock is currently under heavy development, and many features are missing in release.</p>
                  <p>Todo list includes linking third-party accouns (Facebook, github, Twitter, LinkedIn etc.), session management, privacy settings and others. </p>
                </mui.CardText>
              </mui.Paper>
            </Col> */ }

          </Row>
        </Grid>


      </DocumentTitle>
    );
  }

  nextFormStep(e, formKey) {
    e.preventDefault();
    let state = this.state;
    state.formStep[formKey]++
    this.setState(state);
    this.setState({test:Math.random()});
  }

  resetFormStep(e, formKey) {
    e.preventDefault();
    let state = this.state;
    state.formStep[formKey] = 1;
    this.setState(state);
    this.setState({test:Math.random()});
  }


  handleFormSubmit(e, formKey) {
    e.preventDefault();
    const data = this.props.users.getIn(['forms', 'id', this.props.users.viewer.id, formKey]).data;

    this.props.actions.saveUserUpdateForm(this.props.users.viewer.id, formKey, data.toJS())
  }

}
