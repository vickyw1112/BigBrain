import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GameCard from '../components/gameCard';
import { Grid, Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import API_URL from '../constants';
import NewGameForm from '../components/newGameForm';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cardsContainer: {
    width: '95%',
    margin: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 'medium',
    marginLeft: 10
  },
  buttonWrap: {
    width: '95%',
    display: 'flex',
    margin: 'auto',
    marginTop: 30,
    marginBottom: 30,
  },
  button: {
    textTransform: 'none',
  },
  centerRow: {
    display: 'flex',
    flexFlow: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [cards, setCards] = useState([]);
  const history = useHistory();
  const isLogged = useSelector(state => state.isLogged);
  const [open, setOpen] = useState(false);
  // shared by all game cards, if any of one changed this value to true then refetch
  const [edit, setEdit] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!isLogged.loggedIn) {
    history.push('/login');
    window.location.reload();
  } else {
    history.push('./dashboard');
    // only render page when it's asked to do so
    useEffect(() => {
      fetch(`${API_URL}/admin/quiz`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          let i = 0;
          const cardList = [];
          let row = [];
          data.quizzes.forEach(g => {
            row.push(
              <div key={i}>
                <Grid container item xs={4} lg={3} >
                  <GameCard
                    id={g.id}
                    title={g.name}
                    createAt={g.createdAt}
                    setEdit={setEdit}
                    img={g.thumbnail} />
                </Grid>
              </div>
            );
            i += 1;
            if (row.length === 3) {
              cardList.push(
                <Grid container item xs={12} spacing={5} key={i} className={classes.centerRow}>
                  {row}
                </Grid>
              );
              row = [];
              i += 1;
            }
          });
          if (row.length !== 0) {
            // if the rest of game is not a multipler of 3
            // then handle them there
            cardList.push(
              <Grid container item xs={12} spacing={5} key={i} className={classes.centerRow}>
                {row}
              </Grid>
            );
          }
          setCards(cardList);
        })
    }, [open, edit]);
    return (
      <div className={classes.root}>
        <Grid container item xs={12} justify='flex-end' className={classes.buttonWrap}>
          <Button
            className={classes.button}
            variant='contained' color='primary'
            onClick={handleClickOpen}
          >Add New Game
              <AddBoxIcon className={classes.actionIcon} /></Button>
        </Grid>
        <Grid container className={classes.cardsContainer} item spacing={4}>
          {cards}
        </Grid>
        <NewGameForm open={open} handleClose={handleClose} />
      </div >
    );
  }
}

export default Dashboard;
