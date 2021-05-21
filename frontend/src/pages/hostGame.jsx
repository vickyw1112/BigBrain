import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, Button, Typography } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { useHistory, useParams } from 'react-router';
import uuid from 'react-uuid';
import API_URL from '../constants';

const useStyles = makeStyles(() => ({
  pageContainer: {
    margin: 0,
    backgroundPosition: 'center',
    height: '100vh',
    width: '100vw'
  },
  welcomeHeader: {
    margin: 'auto',
    backgroundColor: 'white',
    width: '60vw',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    padding: '10px',
    borderBottomLeftRadius: '15px',
    borderBottomRightRadius: '15px',
  },
  actionIcon: {
    fontSize: 'medium',
    marginLeft: 10
  },
  buttonWrap: {
    width: '95%',
    display: 'flex',
    margin: 'auto',
    marginTop: 25,
    marginBottom: 30,
  },
  button: {
    color: '#fff',
    backgroundColor: '#3f51b5',
    textTransform: 'none',
  },
  joinedGamePlayerContainer: {
    textAlign: 'center',
    backgroundColor: 'white',
    margin: 'auto',
    width: '70vw',
    borderRadius: '15px'
  },
  mainTextContent: {
    fontFamily: 'Times Newman',
    width: '60%',
    margin: 'auto',
    fontSize: '25px',
    fontWeight: 'bold',
  }
}));
const HostGame = () => {
  const { gameId, sessionId } = useParams();
  const classes = useStyles();
  const [players, setPlayers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/admin/session/${sessionId}/status`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(res.status);
        })
        .then(data => {
          setPlayers(data.results.players);
        })
        .catch(e => console.log(e));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startButonHandler = () => {
    fetch(`${API_URL}/admin/quiz/${gameId}/advance`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res.ok) {
          history.push(`/gamestart/${gameId}/${sessionId}`);
          return res.json();
        }
        throw new Error(res.status);
      })
      .catch(e => console.log(e));
  }
  return (
    <Paper className={classes.pageContainer}>
      <h1 className={classes.welcomeHeader}> Session id: {sessionId}</h1>
      <Grid container item xs={12} justify='center' className={classes.buttonWrap}>
        <Button
          className={classes.button}
          variant='contained' color='primary'
          onClick={startButonHandler}
          data-test-target='HostGameStartButton'
        >
          Start Game <PlayCircleOutlineIcon style={{ marginLeft: 5 }} />
        </Button>
      </Grid>
      {players.length === 0 &&
        <Typography className={classes.joinedGamePlayerContainer}>
          Waiting for players to join ...
        </Typography>
      }
      {players.length !== 0 &&
        <Typography className={classes.joinedGamePlayerContainer}>
          <Typography className={classes.mainTextContent}>
            {players.map(player => (<span key={uuid()}>{player}</span>))}
          </Typography>
          <Typography className={classes.mainTextContent}>
            joined the game
          </Typography>
        </Typography>
      }
    </Paper>
  );
}

export default HostGame;
