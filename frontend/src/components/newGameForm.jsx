import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import API_URL from '../constants';
import { alertSuccess, alertFailure } from '../redux/actions';
import { useDispatch } from 'react-redux';

const NewGameForm = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (name === '') {
      dispatch(alertFailure('Invalid input'));
      return;
    }
    fetch(`${API_URL}/admin/quiz/new`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    }).then(res => {
      if (res.ok) {
        dispatch(alertSuccess('New game success'));
        handleClose();
        return res.json();
      } else if (res.status === 400) {
        dispatch(alertFailure('Invalid input'));
      }
      throw new Error(res.status);
    })
      .catch(e => {
        console.log(e);
      })
  }
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAdd();
    }
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a new game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new game, please enter the game name.
          </DialogContentText>
          <TextField
            onKeyDown={handleKeyDown}
            autoFocus
            margin="dense"
            id="name"
            label="Game name"
            type="text"
            onChange={e => setName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button data-test-target='ConfirmNewGameNameButton' onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
NewGameForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}
export default NewGameForm;
