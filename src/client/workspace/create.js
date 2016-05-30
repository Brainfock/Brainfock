/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {PropTypes, Component} from 'react';
import AsynchronousBlurValidationForm from './components/createWorkspaceForm.js';

class AsynchronousBlurValidation extends Component {

  static propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  };

  componentWillMount() {
    this.props.actions.appSetActiveSectionLabel('Workspaces');
  }

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
