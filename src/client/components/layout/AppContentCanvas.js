/**
 * Brainfock - Community & Business Management Solution
 *
 * @link http://www.brainfock.org
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
let React = require('react');
import StylePropable from 'material-ui';

/**
 * AppContentCanvas is an attempt to keep code in KISS
 */
let AppContentCanvas = React.createClass({
  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  render() {
    let styles = this.props.style?this.props.style:{};

    let header = this.props.header ?
        <div className="page-header clearfix">{this.props.header}</div> : null;
    return (
        <div style={styles} className="app-content-canvas bfk-browse">
          {header}
          <div className="container-fluid">
          <div className="row">
            {this.props.children}
          </div>
          </div>
        </div>
    );
  },

});

module.exports = AppContentCanvas;
