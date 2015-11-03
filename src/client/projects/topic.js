/**
 * Brainfock - business & community management software
 * Copyright (c) 2015, Sergii Gamaiunov
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.org/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
var React = require('react');
var mui = require('material-ui');
var bs = require('react-bootstrap'),
  {Nav, NavItem, ButtonToolbar, ButtonGroup, Button, Glyphicon, TabbedArea, TabPane, DropdownButton, MenuItem} = bs;

var Loader = require('../components/Loader');
var AppContentCanvas = require('../components/layout/AppContentCanvas');
import OperationsDropdown from './components/OperationsDropdown.js'
import Issue from './components/Issue.js'

/**
 * TopicView
 *
 * @todo define propTypes
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
var TopicView = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  /**
   * prealod board info
   */
  componentDidMount: function () {
    if(process.env.IS_BROWSER==true) {
      if (this.props.params.id) {
        this.props.topic_actions.loadNamespaceTopicByNum(this.props.params.namespace, this.props.params.board_id, this.props.params.group_key, this.props.params.id);
      }
    }
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.params.namespace && newProps.params.group_key && newProps.params.id && (this.props.params !== newProps.params)) {
      this.props.topic_actions.loadNamespaceTopicByNum(this.props.params.namespace, this.props.params.board_id, this.props.params.group_key, this.props.params.id);
    }
  },

  /**
   * @returns {XML}
   */
  render: function () {

    const viewTopic = this.props.boards.viewTopic;

    if (viewTopic.loading == true &&
        // replace whole page by loader only if we're switching between topics, or else we get unnecessary redraw of comments etc.
      (!viewTopic.id || parseInt(viewTopic.contextTopicNum) !== parseInt(this.props.params.id))) {

      return (
        <AppContentCanvas header={
          <h4 className="pull-left"><Loader /></h4>
        }/>
      );
    }

    let style = {
      opacity: this.props.boards.viewTopic.loading == true ? .3 : 1,
      position: 'relative'
    };

    return (
      <div style={style} className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
        <Issue
          actions={this.props.actions}
          io={this.props.io}
          topic={this.props.boards.viewTopic}
          topic_actions={this.props.topic_actions}
          />
      </div>
    );
  },
});

module.exports = TopicView;
