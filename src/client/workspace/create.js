/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React, {PropTypes, Component} from 'react';
import AsynchronousBlurValidationForm from './components/createWorkspaceForm.js';

class AsynchronousBlurValidation extends Component {

  static propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  };

  render() {
    return (
      <AsynchronousBlurValidationForm
        onSubmit={this.onSubmit.bind(this)}
        />
    );
  }

  onSubmit(data) {
    this.props.actions.postWorkspace(data)
      .then(({error, payload}) => {
        if (error) {
          // error is handled by redux-form
          //focusInvalidField(this, payload);
        } else
          this.redirectAfterSuccess(payload);
      });
  }

  // TODO: use redux-react-router
  redirectAfterSuccess(payload) {
    const {history} = this.props;
    history.replaceState(null, `/${payload.namespace}?gettingStarted`);
  }

}

export default AsynchronousBlurValidation;
