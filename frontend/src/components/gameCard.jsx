import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import bg from '../bg.jpeg'
import API_URL from '../constants';
import { alertSuccess, alertFailure } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 550,
    margin: '20px 30px',
    '@media (max-width:500px)': {
      width: 350,
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    marginLeft: 'auto',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const GameCard = (props) => {
  const { id, title, createAt, setEdit, img } = props;
  const createdAt = new Date(createAt);
  const classes = useStyles();
  const [gameData, setGameData] = useState({ questions: [], active: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [editGame, setEditGame] = useState(false);
  const [gamePlaying, setGamePlaying] = useState(false);
  // const [gamePlayMsg, setGamePlayMsg] = useState('PLAY');
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [openShowResultDialog, setOpenShowResultDialog] = useState(false);
  const [sessionId, setSessionId] = useState(undefined);
  const [newImage, setNewImage] = useState(img);
  const [newTitle, setNewTitle] = useState(title);
  const [totalTime, setTotalTime] = useState(0);
  const [jsonOpen, setJsonClose] = useState(false);
  // for edit game title and image
  const [gameOpen, setGameOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [gameJson, setGameJson] = useState(null);
  // when admin copyed the session url redircting admin to game start page
  // wait for players to join
  const go2GameStartPage = () => {
    setOpenSessionDialog(false);
    navigator.clipboard.writeText(`http://localhost:3000/playground/${sessionId}`);
    history.push(`/hostgame/${id}/${sessionId}`);
  }

  useEffect(() => {
    fetch(`${API_URL}/admin/quiz/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        let time = 0;
        if (data.questions.length) {
          data.questions.forEach(q => {
            time += parseInt(q.timeLimit);
          });
        }
        setTotalTime(time);
        setGameData(data);
        if (gameData.active) {
          setGamePlaying(true);
        } else {
          setGamePlaying(false);
        }
        setNewTitle(data.name);
        setNewImage(data.thumbnail);
      })
  }, [id, editGame, gamePlaying, jsonOpen])

  const handleSeeResult = () => {
    console.log('session id game card page: ', sessionId);
    setOpenShowResultDialog(false);
    const cachedSessionId = localStorage.getItem('sessionId');
    if (sessionId === undefined) {
      history.push(`/result/${cachedSessionId}`);
    } else {
      history.push(`/result/${sessionId}`);
    }
  }

  /// for json file upload
  const handleUploadJson = () => {
    const { questions, image, gameName } = gameJson;
    // for data validation
    const newQuestions = questions.map(q => {
      const {
        id,
        title,
        answers,
        answerOption,
        timeLimit,
        points,
        imgUrl,
        linkUrl
      } = q;
      return {
        id,
        title,
        answers,
        answerOption,
        timeLimit,
        points,
        imgUrl,
        linkUrl
      };
    })

    fetch(`${API_URL}/admin/quiz/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questions: newQuestions,
        name: gameName,
        thumbnail: image,
      })
    }).then(res => {
      handleJsonClose();
      console.log(res);
    })
  }

  const handleJsonClose = () => {
    setJsonClose(false);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlegameOpenClose = () => {
    setGameOpen(false)
  }

  const handleDelete = () => {
    handleClose();
    fetch(`${API_URL}/admin/quiz/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res.ok) {
          dispatch(alertSuccess('Delete successfully'));
          setEdit(prevState => !prevState);
          return res.json();
        } else if (res.status === 400) {
          dispatch(alertFailure('Invalid input'));
        } else {
          dispatch(alertFailure('Invalid token'));
        }
        throw new Error(res.status);
      })
      .catch(e => console.log(e));
  }

  const handleEditGameQuestion = () => {
    handleClose();
    history.push(`/dashboard/${id}`);
  }

  const handleEditGame = () => {
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
        throw new Error(res.status);
      })
      .then(data => {
        data.name = newTitle;
        data.thumbnail = newImage;

        fetch(`${API_URL}/admin/quiz/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
          .then(res => {
            if (res.ok) {
              setEditGame(preState => !preState);
              handlegameOpenClose();
            } else {
              throw new Error(res.status);
            }
          });
      })
      .catch(e => console.log(e));
  }

  const handlePlayGame = () => {
    if (!gameData.active) {
      fetch(`${API_URL}/admin/quiz/${id}/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if (res.ok) {
            setOpenSessionDialog(true)
            setEditGame(!editGame);
            fetch(`${API_URL}/admin/quiz/${id}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            })
              .then(res => {
                if (res.ok) {
                  res.json().then(res => {
                    setSessionId(res.active);
                    localStorage.setItem('sessionId', res.active);
                  })
                } else if (res.status === 400) {
                  dispatch(alertFailure('Invalid input'));
                } else {
                  dispatch(alertFailure('Invalid token'));
                }
              })
              .catch(e => console.log(e))
          } else if (res.status === 400) {
            dispatch(alertFailure('Invalid input'));
          } else {
            dispatch(alertFailure('Invalid token'));
          }
        })
        .catch(e => console.log(e))
    } else {
      fetch(`${API_URL}/admin/quiz/${id}/end`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if (res.ok) {
            setOpenShowResultDialog(true);
            setEditGame(!editGame);
            return res.json();
          } else if (res.status === 400) {
            dispatch(alertFailure('Invalid input'));
          } else {
            dispatch(alertFailure('Invalid token'));
          }
        })
        .catch(e => console.log(e))
    }
  }

  // reder different color of button based on session status
  const renderButton = () => {
    if (gameData.active) {
      return (
        <Button
          variant='contained'
          color='primary'
          style={{ backgroundColor: 'red' }}
          className={classes.expand}
          aria-label="start session"
          onClick={handlePlayGame}
        >STOP
        </Button>
      );
    } else {
      return (
        <Button
          variant='contained'
          color='primary'
          style={{ backgroundColor: 'green' }}
          className={classes.expand}
          aria-label="start session"
          onClick={handlePlayGame}
          data-test-target='PlayGameButton'
        >PLAY
        </Button>
      );
    }
  }

  const handleJsonFile = (e) => {
    if (window.FileReader) {
      const file = e[0];
      const reader = new FileReader();
      if (file && file.type.match('.json')) {
        reader.readAsText(file);
      }
      reader.onloadend = function () {
        setGameJson(JSON.parse(reader.result));
      }
    }
  }

  const handleImage = (e) => {
    if (window.FileReader) {
      const file = e[0];
      const reader = new FileReader();
      if (file && file.type.match('image.*')) {
        reader.readAsDataURL(file);
      }
      reader.onloadend = function () {
        setNewImage(reader.result)
      }
    }
  }

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem data-test-target='GameCardMenuEditGame' onClick={e => { handleClose(); setGameOpen(true) }}>Edit Game</MenuItem>
      <MenuItem data-test-target='GameCardMenuEditGameQuestion' onClick={handleEditGameQuestion}>Edit Game Question</MenuItem>
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
      <MenuItem onClick={e => { handleClose(); setJsonClose(true) }}>Upload Json</MenuItem>
    </Menu>
  );
  return (
    <div>
      <Dialog
        open={openSessionDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Session id: {sessionId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary"
            onClick={go2GameStartPage}
            data-test-target='CopySessionIdButton'
          >
            Copy
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openShowResultDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to view the results?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenShowResultDialog(false) }} color="primary">
            No
          </Button>
          <Button onClick={handleSeeResult} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="user-image" className={classes.avatar}>
              {title.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={newTitle}
          subheader={createdAt.toDateString()}
        />
        <CardMedia
          className={classes.media}
          image={newImage ?? bg}
          title="game image"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Game id: {id}, Number of questions: {gameData.questions.length}, Total time to finish: {totalTime} seconds.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          {renderButton()}
        </CardActions>
      </Card>
      {renderMenu}

      <Dialog
        open={gameOpen}
        onClose={handlegameOpenClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="form-dialog-title">Update Game Info</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit game tile or Upload a new cover image for current game.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Game Name"
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            fullWidth
            data-test-target='EditGameNameField'
          />
          <div style={{ height: 20 }} />
          <DropzoneArea
            acceptedFiles={['image/*']}
            filesLimit={1}
            dropzoneText={'Drag and drop an image here or click'}
            onChange={(files) => handleImage(files)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlegameOpenClose} color="primary">
            Cancel
          </Button>
          <Button data-test-target='SubmitNewGameNameButton' onClick={handleEditGame} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={jsonOpen}
        onClose={handleJsonClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="form-dialog-title">Upload Json template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To upload a json file or template for add new question.
          </DialogContentText>
          <DropzoneArea
            acceptedFiles={['.json']}
            filesLimit={1}
            dropzoneText={'Drag and drop a json template'}
            onChange={(files) => handleJsonFile(files)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJsonClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUploadJson} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

GameCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createAt: PropTypes.string.isRequired,
  setEdit: PropTypes.func.isRequired,
  img: PropTypes.string,
};
GameCard.defaultProps = {
  img: null,
};

export default GameCard;
