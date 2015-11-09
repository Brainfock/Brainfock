/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
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

    const formContent = React.cloneElement(this.props.form, {ref: 'formView'});

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
          background: 'rgb(42, 66, 183)',
          color: '#fff',
          padding: '0 0 25px'
        }}>
          <div className="col-md-6 col-md-offset-3 ">

            <h2>Welcome to discussion boards!</h2>
            <div style={controlStyles}>
              <p>Engage your clients and customers in discussions, build and grow your community, improve communications!</p>
              <RaisedButton
                label="Create your first board"
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
