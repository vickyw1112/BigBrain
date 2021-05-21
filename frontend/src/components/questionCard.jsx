import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ClearIcon from '@material-ui/icons/Clear';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import API_URL from '../constants';
import YouTube from 'react-youtube';
import { useHistory } from 'react-router-dom';
import bg from '../bg.jpeg';

const getYouTubeID = require('get-youtube-id');
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  paperButton: {
    textTransform: 'none'
  }
}));

const QuestionCard = (props) => {
  const classes = useStyles();
  const { id, title, description, time, choices, image, link, qid, handleIsEdit } = props;
  const [showMore, setShowMore] = useState(false);
  const [choicesMsg, setChoicesMsg] = useState(undefined);
  const history = useHistory();
  useEffect(() => {
    let i = 0;
    const choicesList = []
    choices.forEach(choice => {
      choicesList.push(
        <ListItem key={i}>
          <ListItemText
            primary={choice.aBody}
          />
          <ListItemSecondaryAction>
            {(
              choice.isCorrect &&
              <CheckIcon style={{ color: 'green' }} />
            )}
            {(
              !choice.isCorrect &&
              <ClearIcon style={{ color: 'red' }} />
            )}
          </ListItemSecondaryAction>
        </ListItem>

      )
      i += 1;
    })
    setChoicesMsg(choicesList);
  }, []);

  const handleEdit = () => {
    history.push(`/dashboard/${id}/${qid}`);
  }
  const handleDelete = (e) => {
    fetch(`${API_URL}/admin/quiz/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statue);
      })
      .then(data => {
        const newQuestions = data.questions.filter(q => q.id !== qid);
        fetch(`${API_URL}/admin/quiz/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            questions: newQuestions,
          })
        })
          .then(res => {
            if (res.ok) {
              handleIsEdit();
            } else {
              throw new Error(res.status);
            }
          });
      })
      .catch(e => console.log(e));
  }
  const _onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  const opts = {
    height: '100',
    width: '100',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              {(image &&
                <img className={classes.img} alt="complex" src={image} />
              )}
              {(link &&
                <YouTube videoId={getYouTubeID(link)} opts={opts} onReady={_onReady} />
              )}
              {(
                !image && !link &&
                <img className={classes.img} alt="complex" src={bg} />
              )}
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  <span style={{ marginRight: 10 }}>
                    {title.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '8pt', color: 'orange' }}>
                    Time: {time}s
                  </span>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {description}
                </Typography>
              </Grid>
              <Grid item>
                <Button className={classes.paperButton} onClick={() => { setShowMore(!showMore) }}>Show detail</Button>
                <Button className={classes.paperButton} onClick={handleEdit}>Edit</Button>
                <Button className={classes.paperButton} onClick={handleDelete}>Delete </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {showMore &&
          <CardContent>
            <Divider />
            <Typography variant="h6" component="div">
              <List>
                {choicesMsg}
              </List>
            </Typography>
          </CardContent>
        }
      </Paper>
    </div >
  );
}
QuestionCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  choices: PropTypes.array.isRequired,
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  qid: PropTypes.string.isRequired,
  handleIsEdit: PropTypes.func.isRequired,
};

export default QuestionCard;
