/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';
import mui from 'material-ui';
import {Tabs, Tab} from 'react-bootstrap';

import TopicPreview from '../../boards/boards.board.react';
import ConfirmDialog from './ConfirmDialog';

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showDeletePrompt: false
    }
  }

  render() {

    const {msg} = this.props;
    const isLoading = this.props.topic.meta.isFetching==true; // in some views, loading means "loading form scheme"

    return (
      <div>
        <div className="page-header left clearfix">
          <h3>{msg.form.section.main}</h3>
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
            name="summary"
            onChange={this.onChange.bind(this)}
            hintText={msg.form.hint.summary}
            errorText={this.props.topic.meta.errors && this.props.topic.meta.errors.get('summary') || ''}
            value={this.props.topic.data.get('summary')}
            floatingLabelText={msg.form.label.summary}
            />

          <br />

          <mui.TextField
            name="text"
            onChange={this.onChange.bind(this)}
            value={this.props.topic.data.get('text')}
            hintText={msg.form.hint.text}
            errorText={this.props.topic.meta.errors && this.props.topic.meta.errors.get('text') || ''}
            multiLine={true}
            floatingLabelText={msg.form.label.text}
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
                name="logoIcon"
                value={this.props.topic.data.get('logoIcon')}
                onChange={this.onChange.bind(this)}
                hintText={msg.form.hint.logoIcon}
                floatingLabelText={msg.form.label.logoIcon}
                />
              <p>Available icon names listed at:<br/> https://fortawesome.github.io/Font-Awesome/icons/</p>

              <mui.TextField
                name="logoBackground"
                value={this.props.topic.data.get('logoBackground')}
                onChange={this.onChange.bind(this)}
                hintText={msg.form.hint.logoBackground}
                floatingLabelText={msg.form.label.logoBackground}
                />
              <p>Pick Material Design color code from list:<br/> http://material-ui.com/#/customization/colors</p>
            </div>
          </div>

          <h4>{msg.form.section.access}:</h4>

          <mui.Checkbox
            name="accessPrivateYn"
            onCheck={(function(event, isChecked){
              this.onChange({
                target:{
                  name: event.target.name,
                  value: isChecked ? 1 : 0
                }
              })
             }).bind(this)}
            value="1"
            label={msg.form.label.accessPrivate}
            checked={(this.props.topic.data.get('accessPrivateYn') === 1)}
            />

          <mui.RaisedButton label={msg.form.button.save} primary={true} onClick={this.trySave.bind(this)}
                            disabled={isLoading} />

          <hr />
          <h4>{msg.form.section.danger}:</h4>

          <ConfirmDialog
            ref="confirmDialog"
            requireString="path/to/project"
            onDelete={this.onDelete.bind(this)}
            topic={this.props.topic}
            deleteAction={this.props.actions.deleteTopic}
            show={this.state.showDeletePrompt === true}
            onDismiss={()=>{
              this.setState({showDeletePrompt: false})
            }}
            />

          <mui.RaisedButton label={msg.form.deleteItem.button} primary={true} onClick={()=>{this.setState({showDeletePrompt: true})}} backgroundColor='#D64141' />
        </div>
      </div>
    );
  }

  onChange(e) {
    this.props.actions.setNewTopicField(e, {id: this.props.topic.data.id});
  }

  onDelete() {
    // TODO: post global notifiction e.g. `project deleted`
    this.props.history.pushState(null, `/projects`);
  }

  trySave() {
    const {actions, topic} = this.props;

    let data = topic.data.toJS();
    let put_data = {
      summary: data.summary,
      text: data.text,
      typeId: data.typeId,
      accessPrivateYn: data.accessPrivateYn,
      logoIcon: data.logoIcon,
      logoBackground: data.logoBackground,
    };

    actions.save(data.id, put_data)
      .then(({error, payload}) => {
        if (error) {
          //focusInvalidField(this, payload);
        } else {
          // TODO: show some message that had been saved successfully
        }
      });
  }
};
