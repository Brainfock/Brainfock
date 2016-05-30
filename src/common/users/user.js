import {Record, List} from 'immutable';

const User = Record({
  id: '',
  email: '',
  username: '',
  roles: List()
});

export default User;
