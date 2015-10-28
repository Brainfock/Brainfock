import React , {PropTypes} from 'react';
import {LinearProgress} from 'material-ui';

// TODO: i18n
module.exports = React.createClass({
  propTypes: {
    noLabel: PropTypes.bool
  },
  render: function() {
    let propgressBarStyle = {}
    if (!this.props.noLabel) {
      propgressBarStyle = {marginTop: '5%'}
    }
    return (
      <div style={{textAlign:'center',marginTop:!this.props.noLabel ? '10%' : 0}}>
        {!this.props.noLabel && <span><i className="fa fa-cog fa-spin"></i> Loading...</span>}

        <LinearProgress mode="indeterminate" style={propgressBarStyle}/>
      </div>
    );
  }
});
