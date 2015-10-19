export const LOGIN = 'LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SET_FORM_FIELD = 'SET_FORM_FIELD';

const FORM_FIELD_MAX_LENGTH = 100;

const validateForm = (validate, fields) => validate(fields)
  .prop('email').required().email()
  .prop('password').required().simplePassword()
  .promise;

const post = (fetch, endpoint, body) =>
  fetch(`/api/${endpoint}`, {
    body: JSON.stringify(body),
    credentials: 'include', // accept cookies from server, for authentication
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    method: 'post'
  })
  .then(response => {
    if (response.status === 200) return response.json();
    return response.json();
  });

export function setFormField({target: {name, value}}) {
  value = value.slice(0, FORM_FIELD_MAX_LENGTH);
  return {
    type: SET_FORM_FIELD,
    payload: {name, value}
  };
}

export function login(fields) {
  return ({fetch, validate}) => ({
    types: [
      LOGIN,
      LOGIN_SUCCESS,
      LOGIN_ERROR
    ],
    payload: {
      promise: validateForm(validate, fields)
        .then(() => post(fetch, 'users/login?include=user', fields))
        .then(function(value) {
          if (value.error) {
            throw value.error;
          }
          else
            return value;
        }, function(reason) {
          // rejection
        })
        .catch(response => {
          if (response.status === 401)
            throw validate.wrongPassword('password');
          throw response;
        })
    }
  });
}

export function logout(token) {
  return ({fetch, validate}) => ({
    types: [
      LOGOUT,
      LOGOUT_SUCCESS,
      LOGOUT_ERROR
    ],
    payload: {
      promise: fetch(`/api/users/logout?access_token=${token}`, {
        method: 'post',
        credentials: 'include'
      })

    }
  });
}
