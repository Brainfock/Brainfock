import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import ToCheck from '../home/toCheck.react';
import {FormattedHTMLMessage} from 'react-intl';

export default class Home extends Component {

  // Why not .isRequired? https://github.com/rackt/react-router/issues/1505
  static propTypes = {
    msg: PropTypes.object
  }
  static contextTypes = {
    muiTheme: React.PropTypes.object
  };
  getTheme() {
    console.log('this.context.muiTheme.leftNav',this.context.muiTheme.leftNav)
    return  this.context.muiTheme.leftNav;
  }

  render() {
    const {msg} = this.props;
    this.getTheme();

    return (
      <DocumentTitle title={msg.home.title}>
        <div className="home-page" style={{
          marginLeft:this.getTheme().width+10
        }}>
          <p>
            <FormattedHTMLMessage defaultMessage={msg.home.infoHtml} />
          </p>
          <ToCheck msg={msg.home.toCheck} />
        </div>
      </DocumentTitle>
    );
  }

}
