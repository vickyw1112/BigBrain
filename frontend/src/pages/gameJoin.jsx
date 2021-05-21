import React, { useState } from 'react';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import API_URL from '../constants';
import { alertFailure } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'

const GameJoin = () => {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  // const [open, setOpen] = React.useState(false);

  const handleJoin = () => {
    if (playerName === '') {
      dispatch(alertFailure('Name can not be empty'))
    }
    fetch(`${API_URL}/play/join/${sessionId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: playerName })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        dispatch(alertFailure('Join failure'))
        throw new Error(res.status);
      })
      .then(data => {
        history.push(`/playground/${sessionId}/${data.playerId}`);
      })
      .catch(e => console.log(e));
  }

  return (
    <Grid container
      style={{ display: 'flex', alignContent: 'center', marginTop: 10, flexDirection: 'column' }}>
      <Grid item xs={12} sm={12}>
        <h1 style={{ textAlign: 'center' }}>Welcome to join {sessionId}</h1>
      </Grid>
      <Grid item xs={12} sm={6}>
        <form noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            label="Enter name to join"
            variant="outlined"
            fullWidth
            onChange={e => { setPlayerName(e.target.value) }} />
        </form>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          fullWidth
          style={{ marginTop: 10, color: 'white', backgroundColor: 'green' }}
          onClick={handleJoin}
        >
          Join
          </Button>

      </Grid>

    </Grid >
  );
}

export default GameJoin;
