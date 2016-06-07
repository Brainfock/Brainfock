import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {RaisedButton, Paper} from 'material-ui';


export default class ProjectsEmpty extends Component {

  static propTypes = {
    boards: PropTypes.object.isRequired,
    form: PropTypes.node.isRequired,
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
          background: 'rgb(129, 59, 173)',
          color: '#fff',
          padding: '0 0 25px'
        }}>
          <div className="col-md-6 col-md-offset-3 ">

            <h2>Welcome to issue management!</h2>

            <div style={controlStyles}>
              <p>Start improving your organization's management and workflows with Brainfock Project Management!</p>

              <p>Manage product and business development, sales and issue tracking.</p>

              <p style={{display:'none'}}>Organize projects into workspaces.
                Use default schemes or take advantage of customization powers of Brainfock.</p>
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
