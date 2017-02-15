import Component from 'react-addons-pure-render-mixin';
import DocumentTitle from '../components/Title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class NotFound extends React.Component {

  static propTypes = {
    msg: PropTypes.object
  }

  render() {
    const {msg: {notFound: msg}} = this.props;

    return (
      <DocumentTitle title={msg.title}>
        <div className="notfound-page">
          <h1>{msg.header}</h1>
          <p>{msg.message}</p>
          <Link to="/">{msg.continueMessage}</Link>
        </div>
      </DocumentTitle>
    );
  }

}
