import Component from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
// import {FormattedHTMLMessage} from 'react-intl';
//import {Link} from 'react-router';

export default class ToCheck extends React.Component {

  static propTypes = {
    msg: PropTypes.object.isRequired
  }

  render() {
    const {msg} = this.props;

    return (
      <div className="tocheck">
        <h3>{msg.header}</h3>
        <ul>
          {msg.itemListHtml.map(item =>
            <li key={item.key}>
                {item.txt}
            </li>
          )}
          { /*<li>
            {msg.isomorphicPage}{' '}
            <Link to="/this-is-not-the-web-page-you-are-looking-for">404</Link>.
           </li> */ }
          <li>
            {msg.andMuchMore}
          </li>
        </ul>
      </div>
    );
  }

}
