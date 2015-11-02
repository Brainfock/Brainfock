import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import focusInvalidField from '../lib/focusInvalidField';
import {Grid, Row, Col} from 'react-bootstrap';
import mui from 'material-ui';

if (process.env.IS_BROWSER)
  require('./Login.styl');

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
      <div className="login" style={{marginTop:20}}>
        <Grid>
          <Row className="show-grid">
            <Col sm={8} smPush={4} xs={12}>
              <form onSubmit={::this.onFormSubmit}>
                <fieldset disabled={form.disabled}>
                  <legend>{msg.legend}</legend>
                  <mui.TextField
                    autoFocus
                    hintText={msg.placeholder.email}
                    name="email"
                    onChange={actions.setFormField}
                    value={form.fields.email}/>
                  <br />
                  <mui.TextField
                    hintText={msg.placeholder.password}
                    name="password"
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
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
