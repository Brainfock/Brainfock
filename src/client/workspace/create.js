/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
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
