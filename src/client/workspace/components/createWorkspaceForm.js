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
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {reduxForm} from 'redux-form';
export const fields = ['namespace', 'name'];
import {TextField, Paper, RaisedButton} from 'material-ui';

const validate = values => {
  const errors = {};
  if (!values.namespace) {
    errors.namespace = 'Required namespace';
  }
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

const asyncValidate = (values/*, dispatch */) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if ((['projects', 'admin', 'issues']).indexOf(values.namespace) !== -1) {
        reject({namespace: 'That namespace is taken'});
      } else {
        resolve();
      }
      //if (['john', 'paul', 'george', 'admin'].includes(values.namespace)) {
      //  reject({namespace: 'That namespace is taken'});
      //} else {
      //  resolve();
      //}
    }, 1); // simulate server latency
  });
};

class AsynchronousBlurValidationForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };
  static contextTypes = {
    muiTheme: PropTypes.object
  };
  render() {
    const {asyncValidating, fields: {namespace, name}, resetForm, handleSubmit, error} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div
          className="clearfix"
          style={{
            backgroundColor:'#4660D8',
            color: '#fff',
            padding: '0 20px 20px'
          }}
          >
          <div className="col-md-5 col-md-offset-4 col-sm-offset-2">
            <div style={{paddingLeft:20}}>
              <h1>Create a Workspace</h1>
            </div>
          </div>

          <div className="col-sm-offset-2 col-sm-8  col-md-5 col-md-offset-4 col-lg-4 col-lg-offset-4">
            <Paper
              className="clearfix"
              style={{
                margin: 20,
                padding: '20px 30px 20px 20px'
              }} >
              {error && <div className="alert alert-danger">{error}</div>}
              <TextField
                errorText={namespace.touched && namespace.error && namespace.error}
                fullWidth
                placeholder="namespace"
                type="text"
                {...namespace} />
              {asyncValidating &&
                <i className="fa fa-spin fa-circle-o-notch"
                   style={{
                     position: 'absolute',
                     top: 17
                   }}/>
              }
              <TextField
                errorText={name.touched && name.error && name.error}
                fullWidth
                placeholder="name"
                type="text"
                {...name} />
              {asyncValidating &&
                <i className="fa fa-spin fa-circle-o-notch"
                   style={{
                     position: 'absolute',
                     top: 17
                   }}
                  />
              }
              <div className="row" style={{
                height: this.context.muiTheme.button.height
              }}>
                <RaisedButton
                  label="Next"
                  onClick={handleSubmit}
                  primary
                  style={{
                    margin: 10,
                    position: 'absolute',
                    right: 50
                  }}
                  />
              </div>
            </Paper>

            <div style={{
              padding: '0 40px 20px 0'
            }}>
              <Link style={{
                color:'white',
                float:'right',
                padding: 0
              }}
                    to='/wiki/Brainfock:Workspace'>Help</Link>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'createWorkspace',
  fields,
  asyncValidate,
  asyncBlurFields: ['namespace'],
  validate
})(AsynchronousBlurValidationForm);
