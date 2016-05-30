export default function stateToJS(state) {
  return Object.keys(state).reduce((acc, key) => {
    // allowing non-immutable data for `form` (redux-form) only
    const data = (!state[key].toJS && key === 'form')
      ? state[key]
      : state[key].toJS();
    return {...acc, [key]: data};
  }, {});
}
