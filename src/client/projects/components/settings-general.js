/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {PropTypes} from 'react';
import mui from 'material-ui';

import TopicPreview from '../../boards/boards.board.react';
import ConfirmDialog from './ConfirmDialog';

export default class Dashboard extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    topic: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDeletePrompt: false
    };
  }

  render() {
    const {msg} = this.props;
    const isLoading = this.props.topic.meta.isFetching === true; // in some views, loading means "loading form scheme"

    return (
      <div>
        <div className="page-header left clearfix">
          <h3>{msg.form.section.main} <sup>(id: {this.props.topic.data.get('id')})</sup></h3>
        </div>
        <div className="container-fluid">
          <h4 style={{display:'none'}}>{msg.form.section.general}:</h4>

          {this.props.topic.meta.error && this.props.topic.meta.error &&
          <div className="alert alert-danger">
             {this.props.topic.meta.error}
             {this.props.topic.meta.isSubmitting &&
             <span> <span className="fa fa-spin fa-circle-o-notch"></span></span>}
          </div>}
          <mui.TextField
            errorText={this.props.topic.meta.errors && this.props.topic.meta.errors.get('summary') || ''}
            floatingLabelText={msg.form.label.summary}
            hintText={msg.form.hint.summary}
            name="summary"
            onChange={this.onChange.bind(this)}
            value={this.props.topic.data.get('summary')}
            />

          <br />

          <mui.TextField
            errorText={this.props.topic.meta.errors && this.props.topic.meta.errors.get('text') || ''}
            floatingLabelText={msg.form.label.text}
            hintText={msg.form.hint.text}
            multiLine
            name="text"
            onChange={this.onChange.bind(this)}
            value={this.props.topic.data.get('text')}
            />

          <br />

          <h4>Logo settings:</h4>
          <div className="row ">

            <div className="col-md-push-6 col-md-6">
              <h5>Preview:</h5>
              <mui.Paper>
                <TopicPreview isPreview todo={this.props.topic.data} />
              </mui.Paper>
            </div>

            <div className="col-md-6 col-md-pull-6">
              <mui.TextField
                floatingLabelText={msg.form.label.logoIcon}
                hintText={msg.form.hint.logoIcon}
                name="logoIcon"
                onChange={this.onChange.bind(this)}
                value={this.props.topic.data.get('logoIcon')}
                />
              <p>Available icon names listed at:<br/> https://fortawesome.github.io/Font-Awesome/icons/</p>

              <mui.TextField
                floatingLabelText={msg.form.label.logoBackground}
                hintText={msg.form.hint.logoBackground}
                name="logoBackground"
                onChange={this.onChange.bind(this)}
                value={this.props.topic.data.get('logoBackground')}
                />
              <p>Pick Material Design color code from list:<br/> http://material-ui.com/#/customization/colors</p>
            </div>
          </div>

          <h4>{msg.form.section.access}:</h4>

          <mui.Checkbox
            checked={(this.props.topic.data.get('accessPrivateYn') === 1)}
            label={msg.form.label.accessPrivate}
            name="accessPrivateYn"
            onCheck={(function(event, isChecked) {
              this.onChange({
                target:{
                  name: event.target.name,
                  value: isChecked ? 1 : 0
                }
              });
            }).bind(this)}
            value="1"
            />

          <mui.RaisedButton
            disabled={isLoading}
            label={msg.form.button.save}
            onClick={this.trySave.bind(this)}
            primary
            />
          <hr />
          <h4>{msg.form.section.danger}:</h4>
          <ConfirmDialog
            deleteAction={this.props.actions.deleteTopic}
            onDelete={this.onDelete.bind(this)}
            onDismiss={()=>{
              this.setState({showDeletePrompt: false});
            }}
            ref="confirmDialog"
            requireString="path/to/project"
            show={this.state.showDeletePrompt === true}
            topic={this.props.topic}
            />

          <mui.RaisedButton backgroundColor='#D64141'  label={msg.form.deleteItem.button} onClick={()=>{this.setState({showDeletePrompt: true});}} primary />
        </div>
      </div>
    );
  }

  onChange(e) {
    this.props.actions.setNewTopicField(e, {id: this.props.topic.data.id});
  }

  onDelete() {
    // TODO: post global notifiction e.g. `project deleted`
    this.props.history.pushState(null, '/projects');
  }

  trySave() {
    const {actions, topic} = this.props;

    let data = topic.data.toJS();
    let putData = {
      summary: data.summary,
      text: data.text,
      typeId: data.typeId,
      accessPrivateYn: data.accessPrivateYn,
      logoIcon: data.logoIcon,
      logoBackground: data.logoBackground,
    };

    actions.save(data.id, putData)
      .then(({error, payload}) => {
        if (error) {
          //focusInvalidField(this, payload);
        } else {
          // TODO: show some message that had been saved successfully
        }
      });
  }
};
