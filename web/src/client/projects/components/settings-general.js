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
import React from 'react';
import mui from 'material-ui';
import {Tabs, Tab} from 'react-bootstrap';

export default class Dashboard extends React.Component{

  render()
  {
    const {msg} = this.props;
    const isLoading = this.props.topic.loading==true;
    console.log('isLoading', isLoading)
    return (
      <div>
        <div className="page-header left clearfix">
          <h3>{msg.form.section.main}</h3>
        </div>
        <div className="container-fluid">

          <h4>{msg.form.section.general}:</h4>

          <mui.TextField
            name="summary"
            onChange={this.props.actions.setNewTopicField}
            hintText={msg.form.hint.summary}
            errorText=""
            value={this.props.topic.get('summary')}
            floatingLabelText={msg.form.label.summary}
            />

          <br />

          <mui.TextField
            name="text"
            onChange={this.props.actions.setNewTopicField}
            value={this.props.topic.get('text')}
            hintText={msg.form.hint.text}
            errorText=""
            multiLine={true}
            floatingLabelText={msg.form.label.text}
            />

          <br />

          <mui.TextField
            name="logoIcon"
            value={this.props.topic.get('logoIcon')}
            onChange={this.props.actions.setNewTopicField}
            hintText={msg.form.hint.logoIcon}
            floatingLabelText={msg.form.label.logoIcon}
            />

          <mui.TextField
            name="logoBackground"
            value={this.props.topic.get('logoBackground')}
            onChange={this.props.actions.setNewTopicField}
            hintText={msg.form.hint.logoBackground}
            floatingLabelText={msg.form.label.logoBackground}
            />

          <h4>{msg.form.section.access}:</h4>

          <mui.Checkbox
            name="accessPrivateYn"
            onCheck={(function(event, isChecked){
              this.props.actions.setNewTopicField({
                target:{
                  name: event.target.name,
                  value: isChecked
                }
              })
             }).bind(this)}
            value="1"
            label={msg.form.label.accessPrivate}
            checked={this.props.topic.get('accessPrivateYn')==1}
            />

          <mui.RaisedButton label={msg.form.button.save} primary={true} onClick={this.trySave.bind(this)}
                            disabled={isLoading} />

          <hr />
          <h4>{msg.form.section.danger}:</h4>


          <mui.RaisedButton label={msg.form.deleteItem.button} primary={true} onClick={this.askDelete} backgroundColor='#D64141' />
        </div>
      </div>
    );
  }

  trySave()
  {
    const {actions, topic} = this.props;

    let data = topic.toJS();
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
          alert('Error! Check console');
          console.log(error);
          //focusInvalidField(this, payload);
        } else {
          // TODO: show some message that had been saved successfully
        }
      });
  }
};
