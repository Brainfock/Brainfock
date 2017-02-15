import Component from 'react-addons-pure-render-mixin';
import DocumentTitle from '../components/Title';
import Login from '../auth/login.react';
import React, {PropTypes} from 'react';

export default class Auth extends React.Component {

  static propTypes = {
    msg: PropTypes.object
  }

  render() {
    const {msg} = this.props;

    return (
      <DocumentTitle title={msg.auth.index.title}>
        <div className="login-page">
          <Login {...this.props} />
        </div>
      </DocumentTitle>
    );
  }

}
