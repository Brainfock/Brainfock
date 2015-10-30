import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {RaisedButton, Paper} from 'material-ui';
var bs = require('react-bootstrap'),
  {Nav, NavItem, ButtonToolbar, ButtonGroup, Button, Glyphicon, TabbedArea, TabPane, DropdownButton, MenuItem} = bs;


export default class ProjectsEmpty extends Component {

  static propTypes = {
    operations: PropTypes.array.isRequired,
    onSelectDelete: PropTypes.func.isRequired,
    activeStageId: PropTypes.any,

  };

  /**
   * @todo l10n
   * @returns {XML}
   */
  render() {

    let operaitons = [];
    let i = 0;
    const self = this;
    if (this.props.operations) {

      this.props.operations.forEach(op => {
        i++;
        var _style = {};
        var active = false;
        if (this.props.activeStageId === op.id) {
          _style['font-weight'] = 800;
          active = true;
        }
        operaitons.push(<MenuItem
          active={active}
          eventKey={i}
          onSelect={() => self.props.handleOperation(op.id)
          }
          >
          {op.name}</MenuItem>);
      });
    }

    operaitons.push(<MenuItem divider/>);
    operaitons.push(
      <MenuItem
        className="ui-alert-link"
        eventKey={i++}
        onSelect={this.props.onSelectDelete}
        >
        Delete
      </MenuItem>);
    return (
      <DropdownButton key={i++} className="pull-right" eventKey={i} id="operations" title="">
        {operaitons}
      </DropdownButton>
    )
  }
}
