const Alert = (state = {}, action) => {
  switch (action.type) {
    case 'ALERT_SUCCESS':
      return {
        type: 'success',
        message: action.message,
      }
    case 'ALERT_FAILURE':
      return {
        type: 'error',
        message: action.message,
      }
    case 'ALERT_CLEAR':
      return {};
    default:
      return state;
  }
}
export default Alert;
