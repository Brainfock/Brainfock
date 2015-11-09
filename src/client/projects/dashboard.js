/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
import React from 'react';
export default class Dashboard extends React.Component{

  render()
  {
    const {boards:{list, board, group}, topic_actions, msg, history} = this.props;

    return (
      <div className="wiki-wrapper">
        <div className="wiki-page">
          <div className="container-fluid">
            <div className="row">
            Project <b>{board.summary}</b> dashboard is in development
            </div>
          </div>
        </div>

      </div>
    );
  }
};
