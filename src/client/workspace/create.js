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
import React, {Component} from 'react';
import AsynchronousBlurValidationForm, {fields} from './components/createWorkspaceForm.js';
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from '../../common';
import {initialize} from 'redux-form';

class AsynchronousBlurValidation extends Component {
  render() {
    console.log('AsynchronousBlurValidation props',this.props)
   // const {children, ...passProps} = this.props;
    return (
      <AsynchronousBlurValidationForm

        onSubmit={this.onSubmit.bind(this)}
        />
    );
  }

  onSubmit(data) {
    // data is actually a synthetic event
   console.log('SUBMIT', data);
    //this.props.dispatch(initialize('newItemForm', {}));
  }

}

export default AsynchronousBlurValidation;