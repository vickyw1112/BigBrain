export const loginSuccess = (token) => {
  return {
    type: 'LOGIN_SUCCESS',
    token,
  };
}

export const loginFailure = () => {
  return {
    type: 'LOGIN_FAILURE',
  };
}

export const signupSuccess = (token) => {
  return {
    type: 'SIGNUP_SUCCESS',
    token,
  };
}

export const signupFailure = () => {
  return {
    type: 'SIGNUP_FAILURE',
  };
}

export const logoutSuccess = () => {
  return {
    type: 'LOGOUT_SUCCESS',
  };
}

export const alertSuccess = (message) => {
  return {
    type: 'ALERT_SUCCESS',
    message: message,
  };
}

export const alertFailure = (message) => {
  return {
    type: 'ALERT_FAILURE',
    message: message,
  };
}

export const alertClear = () => {
  return {
    type: 'ALERT_CLEAR',
  };
}
