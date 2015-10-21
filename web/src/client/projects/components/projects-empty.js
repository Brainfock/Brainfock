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
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {RaisedButton, Paper} from 'material-ui';

import Form from '../../topic/components/create-topic-form';

export default class ProjectsEmpty extends Component {

  static propTypes = {
    boards: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    topic_actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };
  }

  /**
   * @todo l10n
   * @returns {XML}
   */
  render() {

    const {newTopic, formFields} = this.props.boards;

    const formContent = (
      <Form
        actions={this.props.topic_actions}
        containerStore={null}
        formFields={formFields}
        newTopic={newTopic}
        params={this.props.params}
        ref="formView"
        topicGroup="project"
        />
    );

    let formStyles = {
        padding: 20
      },
      controlStyles = {};

    if (!this.state.showForm) {
      formStyles.display = 'none';
    }
    if (this.state.showForm) {
      controlStyles.display = 'none';
    }

    return (
      <div>
        <div className="clearfix" style={{
          background: 'rgb(129, 59, 173)',
          color: '#fff',
          padding: '0 0 25px'
        }}>
        <div className="col-md-6 col-md-offset-3 ">

          <h2>Welcome to project management!</h2>
          <div style={controlStyles}>
            <p>Manage product and business development, sales and issue tracking.</p>
            <RaisedButton
              label="Create first project"
              onClick={e => this.setState({
                target: e.target,
                showForm: !this.state.showForm
              })}
              primary
              />
          </div>

          <Paper style={formStyles}>

            {formContent}

            <RaisedButton
              label="Save"
              onClick={this.onFormSubmit.bind(this)}
              primary
              style={{marginRight:15}}
              />

            <a
              children="Do it later"
              href="#"
              onClick={e => this.setState({
                target: e.target,
                showForm: !this.state.showForm
              })}
              />
          </Paper>
        </div>
        </div>
      </div>
    );
  }

  onFormSubmit(e) {
    this.refs.formView.onFormSubmit(e);
  }
}
