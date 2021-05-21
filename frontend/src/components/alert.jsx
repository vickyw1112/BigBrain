import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { alertClear } from '../redux/actions';
import { useDispatch } from 'react-redux';
const CustomizedSnackbars = ({ type, message }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    dispatch(alertClear());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert elevation={6} variant="filled" severity={type} onClick={handleClose}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

CustomizedSnackbars.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,

}
export default CustomizedSnackbars;
