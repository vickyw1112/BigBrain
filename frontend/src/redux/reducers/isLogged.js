// check if user has loggin in
const token = localStorage.getItem('token');
const initState = token ? { loggedIn: true, token: token } : { loggedIn: false };

// give current state and action, return next state
const loggedReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      localStorage.setItem('token', action.token);
      return {
        loggedIn: true,
        token: action.token,
      };

    case 'LOGOUT_SUCCESS':
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      localStorage.clear();
      return {
        loggedIn: false,
      }
    default:
      return state;
  }
}
export default loggedReducer;
