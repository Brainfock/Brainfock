import Component from 'react-addons-pure-render-mixin';
import DocumentTitle from '../components/Title';
import React, {PropTypes} from 'react';
// import ToCheck from '../home/toCheck.react';
// import {FormattedHTMLMessage} from 'react-intl';

// <FormattedHTMLMessage defaultMessage={msg.home.infoHtml} />
export default class Home extends React.Component {

  // Why not .isRequired? https://github.com/rackt/react-router/issues/1505
  static propTypes = {
    msg: PropTypes.object
  }
  static contextTypes = {
    muiTheme: React.PropTypes.object
  };
  getTheme() {
    return  this.context.muiTheme.leftNav;
  }

  render() {
    const {msg} = this.props;
    this.getTheme();

    return (
      <DocumentTitle title={msg.home.title}>
        <div className="home-page" style={{
          marginLeft:this.getTheme().width + 10
        }}>
          <p>
            {msg.home.infoHtml}
          </p>
        </div>
      </DocumentTitle>
    );
  }

}

/*
 return (
 <DocumentTitle title={msg.home.title}>
 <div className="home-page" style={{
 marginLeft:this.getTheme().width + 10
 }}>
 <p>
 {msg.home.infoHtml}
 </p>
 <ToCheck msg={msg.home.toCheck} />
 </div>
 </DocumentTitle>
 );
 */