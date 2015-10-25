import React from 'react';
import {LinearProgress} from 'material-ui';

// TODO: i18n
module.exports = React.createClass({
  render: function() {
    return (
      <div style={{textAlign:'center',marginTop:'10%'}}>
        <i className="fa fa-cog fa-spin" ></i> Loading...

        <LinearProgress mode="indeterminate" style={{marginTop:'5%'}} />
      </div>
    );
  }
});
