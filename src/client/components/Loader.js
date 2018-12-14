import React , {PropTypes} from 'react';
import {LinearProgress} from 'material-ui';

// TODO: i18n
module.exports = React.createClass({

  propTypes: {
    asGlobal: PropTypes.bool, // render progress bar on very top of page
    noLabel: PropTypes.bool,
  },

  render: function() {

    let {wrapperStyle, propgressBarStyle} = {};
    if (!this.props.noLabel) {
      propgressBarStyle = {margin: 0}
    }
    if (this.props.asGlobal) {
      wrapperStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999
      }
    }

    return (
      <div>
        <div style={wrapperStyle}>
          <LinearProgress mode="indeterminate" style={propgressBarStyle}/>
        </div>
        {!this.props.noLabel &&
        <div style={{textAlign:'center',marginTop:!this.props.noLabel ? '10%' : 0}}>
          <span><i className="fa fa-cog fa-spin"></i> Loading...</span>
        </div>}
      </div>
    );
  }
});
