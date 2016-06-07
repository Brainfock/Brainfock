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
import mui, {Styles, Avatar, IconButton} from 'material-ui';
const Colors = Styles.Colors;

export default class Dashboard extends React.Component {

  render()
  {
    const {boards:{list, board: {data}, group}, topic_actions, msg, history} = this.props;
    const color = Colors[data.logoBackground];
    const icon = 'fa ' + data.logoIcon;

    return (
      <div className="wiki-wrapper">
        <div className="wiki-page">
          <div className="container-fluid">
            <div className="row">
              <h1>
                <Avatar icon={<span className={icon}/>} backgroundColor={color} /> {data.summary}
              </h1>
              <h3>{data.text}</h3>
            </div>
          </div>
        </div>

      </div>
    );
  }
};
