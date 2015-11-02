import React from 'react';
import mui from 'material-ui';
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
      <div className="alert alert-warning" style={{margin:0,borderRadius:0}}>{message}
        <button onClick={this.props.handleRetry}>Retry</button>
      </div>
    )
  }
};