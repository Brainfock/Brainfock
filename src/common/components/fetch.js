import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';

export default function fetch(action) {

  return Wrapped => class Fetch extends Component {

    static propTypes = {
      app: PropTypes.object,
      dispatch: PropTypes.func,
      location: PropTypes.object,
      params: PropTypes.object,
      users: PropTypes.object,
    };

    // This allows server fetching.
    static fetchAction = action;

    componentDidMount() {
      const {dispatch /*, location, params, app, users*/}=this.props;
      dispatch(action({...this.props}));
     // dispatch(action({location, params, app, users}));
    }

    // // TODO: Fetch if last location pathname has changed.
    // componentWillReceiveProps(nextProps) {
    // }

    render() {
      return <Wrapped {...this.props} />;
    }
  };
}
