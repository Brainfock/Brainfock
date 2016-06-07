import React from 'react';
import {Link} from 'react-router';

class ViewUser extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object,
    children: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
  }

  render() {
    const {children, ...props} = this.props;
    if (children) {
      return React.cloneElement(children, props);
    }
    return (
      <div>
        <h4>Settings index page</h4>
        <ul>
          <li><Link to={`/workspaces/${this.props.params.namespace}/settings/profile`}>Profile</Link></li>
        </ul>
      </div>
    );
  }

}

export default ViewUser;
