import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import focusInvalidField from '../lib/focusInvalidField';
import {Grid, Row, Col} from 'react-bootstrap';
import mui, {Paper} from 'material-ui';

if (process.env.IS_BROWSER)
  require('./login.styl');

export default class Login extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired
  }

  onFormSubmit(e) {
    e.preventDefault();
    const {actions, auth: {form}} = this.props;
    actions.login(form.fields)
      .then(({error, payload}) => {
        if (error)
          focusInvalidField(this, payload);
        else
          this.redirectAfterLogin();
      });
  }

  // TODO: Use redux-react-router.
  redirectAfterLogin() {
    const {history, location} = this.props;
    if (location.state && location.state.nextPathname)
      history.replaceState(null, location.state.nextPathname);
    else
      history.replaceState(null, '/');
  }

  render() {

    const {actions, auth: {form}, msg: {auth: {form: msg}}} = this.props;

    return (
      <div className="login" style={{paddingTop:20}}>
        <Grid>
          <Row>
            <Col sm={6} smOffset={3} xs={6} xsOffset={2}>
              <div className="headline">
                <h1>{msg.legend}</h1>
                </div>
              <Paper>
                <div className="formWrapper" >
                  <form onSubmit={::this.onFormSubmit}>
                    <fieldset disabled={form.disabled}>
                      <mui.TextField
                        autoFocus
                        hintText={msg.placeholder.email}
                        fullWidth
                        name="email"
                        onChange={actions.setFormField}
                        value={form.fields.email}/>
                      <br />
                      <mui.TextField
                        hintText={msg.placeholder.password}
                        name="password"
                        fullWidth
                        onChange={actions.setFormField}
                        type="password"
                        value={form.fields.password}/>
                      <br />
                      <mui.RaisedButton
                        disabled={form.disabled}
                        label={msg.button.login}
                        primary
                        type="submit"
                        />
                      {form.error &&
                      <span className="error-message">{form.error.message}</span>}
                    </fieldset>
                  </form>
                </div>
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
