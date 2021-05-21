import React, { useState } from 'react';
import { Grid, Paper, Avatar, TextField, Button, Typography } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, useHistory } from 'react-router-dom';
import API_URL from '../constants';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/actions';

const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const history = useHistory();
  const [errorMsg, setError] = useState(false);
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    console.log(open);
    setOpen(false);
    setError(false);
  };

  // handle login
  const submitHandle = e => {
    e.preventDefault();
    fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          setError('Invalid email/password');
          dispatch(loginFailure());
          throw new Error('invalid email/password');
        }
      })
      .then(data => {
        dispatch(loginSuccess(data.token));
        history.push('/dashboard');
      })
      .catch(e => {
        console.log(e)
      })
  }

  const gridStyle = {
    margin: '6rem 2rem',
  };

  const paperStyle = {
    padding: 20,
    height: 500,
    margin: 'auto',
    maxWidth: 350,
    minWidth: 300,
    justifyItems: 'center',
    alignItems: 'center',
  };

  const avatarStyle = {
    backgroundColor: '#1bbd7e',
  }
  return (
    <Grid style={gridStyle}>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
          <h2>Log In</h2>
        </Grid>
        <form>
          <TextField
            label='Email address'
            placeholder='Enter email address'
            margin='normal'
            type='email' fullWidth required
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label='Password'
            placeholder='Enter password'
            type='password'
            margin='normal'
            fullWidth required
            onChange={e => setPassword(e.target.value)}
          />
          {errorMsg &&
            <Dialog
              open={true}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Please enter valid email address, password and name!
                   </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus> Agree </Button>
              </DialogActions>
            </Dialog>
          }
          <div style={{ height: 20 }}></div>
          <Button
            color='primary'
            type='buton'
            variant='contained'
            fullWidth
            onClick={submitHandle}
          >
            Log in
            </Button>
          <div style={{ height: 20 }}></div>
          <Typography> Do not have an account?
            <Link to='/signup'>
              Sign Up
            </Link>
          </Typography>
        </form>
      </Paper>
    </Grid >
  );
}

export default LoginPage;
