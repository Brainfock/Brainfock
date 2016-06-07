/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {Styles, Avatar} from 'material-ui';
const Colors = Styles.Colors;

export default class Dashboard extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object,
    boards: React.PropTypes.object,
    children: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
  }

  render() {
    const {boards:{board: {data}}} = this.props;
    const color = Colors[data.logoBackground];
    const icon = 'fa ' + data.logoIcon;

    return (
      <div className="wiki-wrapper">
        <div className="wiki-page">
          <div className="container-fluid">
            <div className="row">
              <h1>
                <Avatar backgroundColor={color} icon={<span className={icon}/>}  /> {data.summary}
              </h1>
              <h3>{data.text}</h3>
            </div>
          </div>
        </div>

      </div>
    );
  }
};
