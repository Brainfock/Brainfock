import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Button, DropdownButton, MenuItem} from 'react-bootstrap';

export default class ProjectsEmpty extends Component {

  static propTypes = {
    activeStageId: PropTypes.any,
    onSelectDelete: PropTypes.func.isRequired,
    operations: PropTypes.array.isRequired
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
        let _style = {};
        let active = false;
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
      <DropdownButton
        className="pull-right"
        eventKey={i}
        id="operations"
        key={i++}
        title="" >
        {operaitons}
      </DropdownButton>
    );
  }
}
