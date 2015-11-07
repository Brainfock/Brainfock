import React from 'react';
import mui, {Card, CardHeader, CardTitle, CardActions, FlatButton, CardText} from 'material-ui';
import Component from 'react-pure-render/component';

export default class FetchActionError extends Component {

  static propTypes = {
    action: React.PropTypes.func.isRequired,
    meta: React.PropTypes.object.isRequired,
    msg: React.PropTypes.object.isRequired,
  };

  constructor(props) {

    super(props);
    this.state = {};
  }

  render() {

    const {error} = this.props.meta;
    const msg = this.props.msg.error.service;

    let message = error;

    if (error === 'Failed to fetch') {
      // system error, that is occuring usually when server is down, on a reboot etc.
      message = msg.fetchFailed;
    }

    return (
      <div style={this.getWrapperStyle()}>
        <CardText>{message}</CardText>
        <CardActions style={{paddingTop:0}}>
          <FlatButton
            onClick={this.props.handleRetry}
            label="Retry"
            style={{padding:100}}
            labelStyle={{color:'#B95252'}}
            />
        </CardActions>
      </div>
    )
    return (
      <div className="alert alert-warning" style={{margin:0,borderRadius:0}}>{message}
        <button onClick={this.props.handleRetry}>Retry</button>
      </div>
    )
  }

  getWrapperStyle() {
    return {
    //  -webkit-box-shadow: inset 0px 7px 8px -4px rgba(92,92,92,0.52);
    //-moz-box-shadow: inset 0px 7px 8px -4px rgba(92,92,92,0.52);
      boxShadow: 'inset 0px 7px 8px -4px rgba(92,92,92,0.45)',
      background: '#efefef',
      color: 'maroon'
    }
  }
};