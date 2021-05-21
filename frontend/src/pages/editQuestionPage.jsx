import { useParams, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { Grid, Button, TextField } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';
import { DropzoneDialog } from 'material-ui-dropzone';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import YouTube from 'react-youtube';
import { useDispatch } from 'react-redux';
import { alertFailure, alertSuccess } from '../redux/actions'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Chip from '@material-ui/core/Chip';
import API_URL from '../constants';
// import uuid from 'react-uuid';

const getYouTubeID = require('get-youtube-id');
const s = (props, ref) => { return <Slide direction="up" ref={ref} {...props} /> };
const Transition = React.forwardRef(s);
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    width: '100%',
    backgroundColor: 'rgb(242, 242, 242)',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
    padding: theme.spacing(3),
    minHeight: 'calc(100vh - 1px)',
  },
  formControl: {
    margin: theme.spacing(1),
    width: 200,
  },
  head: {
    flex: 1,
    justifyContent: 'center',
  },
  body: {
    flex: 2,
  },
  answers: {
    flex: 6,
    display: 'flex',
    justifyContent: 'center',
  },
  answer: {
    width: '100%',
    margin: 10,
    padding: 20,
    fontSize: '18pt',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    textAlign: 'center',
  },
}));
const EditQuestionPage = () => {
  const history = useHistory();
  const { gameId, questionId } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [answer5, setAnswer5] = useState('');
  const [answer6, setAnswer6] = useState('');
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [points, setPoints] = useState('');
  const [answerOption, setAnswerOption] = useState('');
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);
  // ======================================= //
  // handle upload image
  const [image, setImage] = useState({ imgURL: '' });
  // handle youtube link
  const [yl, setYl] = useState({ url: '' });
  const [yId, setyId] = useState('');
  // for handle image dialog
  const [localOpen, setLocalOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);

  // check current answer tyep
  const checkList = [checked1, checked2, checked3, checked4, checked5, checked6];
  useEffect(() => {
    let count = 0;
    for (const i of checkList) {
      if (i === true) {
        count += 1;
      }
    }
    if (count === 0) {
      setAnswerOption('Answer Type');
    } else if (count >= 2) {
      dispatch(alertSuccess('Changing your answer type to muti-select'))
      setAnswerOption('multi-select');
    } else if (count === 1) {
      dispatch(alertSuccess('Changing your answer type to single-select'))
      setAnswerOption('single-select');
    }
  }, [checked1, checked2, checked3, checked4, checked5, checked6]);

  const handleClose = () => {
    history.push(`/dashboard/${gameId}`);
  };

  useEffect(() => {
    fetch(`${API_URL}/admin/quiz/${gameId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then(data => {
        const curQuestion = data.questions.filter(q => { return q.id === questionId })[0];
        setTitle(curQuestion.title);
        setTimeLimit(curQuestion.timeLimit);
        setPoints(curQuestion.points);
        setAnswer1(curQuestion.answers[0].aBody);
        setAnswer2(curQuestion.answers[1].aBody);
        setAnswer3(curQuestion.answers[2].aBody);
        setAnswer4(curQuestion.answers[3].aBody);
        setAnswer5(curQuestion.answers[4].aBody);
        setAnswer6(curQuestion.answers[5].aBody);
        setChecked1(curQuestion.answers[0].isCorrect);
        setChecked2(curQuestion.answers[1].isCorrect);
        setChecked3(curQuestion.answers[2].isCorrect);
        setChecked4(curQuestion.answers[3].isCorrect);
        setChecked5(curQuestion.answers[4].isCorrect);
        setChecked6(curQuestion.answers[5].isCorrect);
        if (curQuestion.imgUrl !== '') {
          setImage({ imgURL: curQuestion.imgUrl });
        } else if (curQuestion.linkUrl !== '') {
          setYl({ url: curQuestion.linkUrl });
          setyId(getYouTubeID(curQuestion.linkUrl));
        }
      })
      .catch(e => console.log(e));
  }, [])

  // upload the data of current question
  const handleSave = () => {
    if (!title) {
      dispatch(alertFailure('Please fill in title'));
      return;
    }
    if (!timeLimit) {
      dispatch(alertFailure('Please set time limit'));
      return;
    }
    if (!(answer1 && answer2 && answer3 && answer4 && answer5 && answer6)) {
      dispatch(alertFailure('Please fill in all the answers'));
      return;
    }
    if (!points) {
      dispatch(alertFailure('Please give points for current question'));
      return;
    }
    if (answerOption === 'Answer Type') {
      dispatch(alertFailure('Please select at least one correct answer'));
      return;
    }
    fetch(`${API_URL}/admin/quiz/${gameId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const newQuestions = data.questions.filter(q => q.id !== questionId);
        const cur = data.questions.filter(q => q.id === questionId)[0];
        cur.title = title;
        cur.timeLimit = timeLimit;
        cur.points = points;
        cur.linkUrl = yl.url;
        cur.imgUrl = image.imgURL;
        cur.answerOption = answerOption;
        cur.answers[0].aBody = answer1;
        cur.answers[1].aBody = answer2;
        cur.answers[2].aBody = answer3;
        cur.answers[3].aBody = answer4;
        cur.answers[4].aBody = answer5;
        cur.answers[5].aBody = answer6;
        cur.answers[0].isCorrect = checked1;
        cur.answers[1].isCorrect = checked2;
        cur.answers[2].isCorrect = checked3;
        cur.answers[3].isCorrect = checked4;
        cur.answers[4].isCorrect = checked5;
        cur.answers[5].isCorrect = checked6;

        fetch(`${API_URL}/admin/quiz/${gameId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            questions: [cur, ...newQuestions]
          })
        })
          .then(res => {
            if (res.ok) {
              handleClose();
            } else {
              throw new Error(res.status);
            }
          })
          .catch(e => console.log(e));
      })
  }
  const handleTimeLimit = (e) => {
    setTimeLimit(e.target.value);
  }

  // handle checkbox
  const handleChecked = (e, option) => {
    switch (option) {
      case 1:
        setChecked1(e.target.checked);
        break;
      case 2:
        setChecked2(e.target.checked);
        break;
      case 3:
        setChecked3(e.target.checked);
        break;
      case 4:
        setChecked4(e.target.checked);
        break;
      case 5:
        setChecked5(e.target.checked);
        break;
      case 6:
        setChecked6(e.target.checked);
        break;
      default:
        break;
    }
  }
  const opts = {
    height: '100',
    width: '100',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  // if use has already uploaded image tehy can not upload video
  const handleIfOnlyLink = () => {
    if (image.imgURL !== '') {
      dispatch(alertFailure('you have already uploaded image '));
    } else {
      setLinkOpen(true);
    }
  }
  const handleIfOnlyImage = () => {
    if (yl.url !== '') {
      dispatch(alertFailure('you have already uploaded YouTube video '));
    } else {
      setLocalOpen(true);
    }
  }
  const handleLinkClose = (e) => {
    console.log(yl.url);
    setLinkOpen(false);
  }
  const handleImage = (e) => {
    const reader = new FileReader();
    const file = e[0];
    reader.onload = () => {
      console.log({
        data: reader.result
      })
      setImage({ imgURL: reader.result });
    }
    reader.readAsDataURL(file);
  }
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <div style={{ height: 20 }}></div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="time-limit">Time limit</InputLabel>
        <Select
          native
          value={timeLimit}
          onChange={handleTimeLimit}
          label="time-limit"
          inputProps={{
            name: 'time-limit',
            id: 'time-limit',
          }}
        >
          <option aria-label="None" value="" />
          <option value={5}>5 seconds</option>
          <option value={10}>10 seconds</option>
          <option value={20}>20 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={90}>1 minute and 30 seconds</option>
        </Select>
      </FormControl>
      <div style={{ height: 20 }}></div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="points">Points</InputLabel>
        <Select
          native
          value={points}
          onChange={e => { setPoints(e.target.value) }}
          label="points"
          inputProps={{
            name: 'points',
            id: 'points',
          }}
        >
          <option aria-label="None" value="" />
          <option value={1}>1</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
        </Select>
      </FormControl>

      <div style={{ height: 20 }}></div>
      <FormControl variant="outlined" className={classes.formControl}>
        <Chip label={answerOption} style={{ color: 'white', fontSize: '12pt', backgroundColor: 'blue' }} />
      </FormControl>
      <div style={{ height: 20 }}></div>
      <Divider />
      <div style={{ height: 20 }}></div>
      <Grid container spacing={2} style={{ flexGrow: 1, marginLeft: 1 }}>
        <Grid item xs={6}>
          <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={handleClose}>
            Exit
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" style={{ backgroundColor: 'green', color: 'white' }} onClick={handleSave}>
            Done
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  // change background color of answe options
  const changeColor = (option) => {
    switch (option) {
      case 1:
        if (answer1) {
          return '#e21b3c';
        }
        break;
      case 2:
        if (answer2) {
          return '#1468ce';
        }
        break;
      case 3:
        if (answer3) {
          return '#d89e00';
        }
        break;
      case 4:
        if (answer4) {
          return '#26890d';
        }
        break;
      case 5:
        if (answer5) {
          return '#8e42ff';
        }
        break;
      case 6:
        if (answer6) {
          return '#1c00ba';
        }
        break;
      default:
        return 'white';
    }
  }
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const _onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        keepMounted
      // onClose={handleClose}
      >
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Hahoot!
          </Typography>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <Grid container className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container className={classes.head}>
              <Grid item xs={12} sm={8} md={8} lg={8}>
                <TextField
                  style={{ backgroundColor: 'white' }}
                  fullWidth
                  placeholder='Start typing your question'
                  margin='normal'
                  multiline={true}
                  rows={2}
                  variant='outlined'
                  value={title}
                  onChange={e => { setTitle(e.target.value) }}
                  inputProps={{ style: { fontSize: '22pt', textAlign: 'center', lineHeight: 1 } }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={6} className={classes.body}>
              <Container maxWidth='md'>
                <Typography component="div" style={{
                  border: '2px dashed rgb(216,216,216)',
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Grid container spacing={3} style={{ justifyContent: 'center', margin: 'auto' }}>
                    <Grid item xs={12} sm={4} md={6} lg={6}>
                      {(image.imgURL &&
                        <div style={{ display: 'flex', flexFlow: 'row wrap', marginBottom: 10 }}>
                          <IconButton variant='contained'
                            onClick={e => { setImage({ imgURL: '' }) }}
                          >
                            <HighlightOffIcon style={{ color: 'red' }} />
                          </IconButton>
                          <img src={`${image.imgURL}`} height="100" width='120' />
                        </div>
                      )}
                      <Button
                        variant='contained'
                        style={{ backgroundColor: 'white', textAlign: 'center' }}
                        onClick={handleIfOnlyImage}
                      >Upload image</Button>
                      <DropzoneDialog
                        acceptedFiles={['image/*']}
                        cancelButtonText={'cancel'}
                        submitButtonText={'submit'}
                        maxFileSize={5000000}
                        filesLimit={1}
                        open={localOpen}
                        onClose={() => setLocalOpen(false)}
                        onSave={(files) => {
                          handleImage(files);
                          setLocalOpen(false);
                        }}
                        showPreviews={true}
                        showFileNamesInPreview={true}
                      />
                    </Grid>
                  </Grid>
                </Typography>
              </Container>
            </Grid>
            <Grid container item xs={6} className={classes.body}>
              <Container maxWidth='md'>
                <Typography component="div" style={{
                  border: '2px dashed rgb(216,216,216)',
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Grid container spacing={3} style={{ justifyContent: 'center', margin: 'auto' }}>
                    <Grid item xs={12} sm={6} md={6} lg={6} >
                      {(yl.url &&
                        <div style={{ display: 'flex', flexFlow: 'row wrap', marginBottom: 10 }}>
                          <IconButton variant='contained'
                            onClick={e => { setYl({ url: '' }, setyId('')) }}
                          >
                            <HighlightOffIcon style={{ color: 'red' }} />
                          </IconButton>
                          <YouTube videoId={yId} opts={opts} onReady={_onReady} />
                        </div>
                      )}
                      <Button
                        variant='contained'
                        style={{ backgroundColor: 'white', textAlign: 'center' }}
                        onClick={e => { handleIfOnlyLink() }}
                      >YouTube link</Button>
                    </Grid>
                  </Grid>
                  <Dialog open={linkOpen} onClose={handleLinkClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Paste YouTube link here</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        To upload Youtube vieo please paste a YouTube link here.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="YouTube link"
                        type="text"
                        value={yl.url}
                        fullWidth
                        onChange={e => { setYl({ url: e.target.value }); setyId(getYouTubeID(e.target.value)) }}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleLinkClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleLinkClose} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Typography>
              </Container>
            </Grid>
            <Grid container className={classes.answers} spacing={2}>
              <Grid container item xs={8} sm={4} md={4} lg={4} >
                <div className={`${classes.answer}`} style={{ backgroundColor: changeColor(1) }}>
                  <TextField
                    label='Answer1'
                    InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                    value={answer1}
                    onChange={e => { setAnswer1(e.target.value) }}
                  />
                  <Checkbox
                    checked={checked1}
                    onChange={e => { handleChecked(e, 1) }}
                    style={{ color: 'white' }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div>
              </Grid>
              <Grid container item xs={8} sm={4} md={4} lg={4}>
                <div className={`${classes.answer}`} style={{ backgroundColor: changeColor(2) }}>
                  <TextField
                    label='Answer2'
                    InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                    value={answer2}
                    onChange={e => { setAnswer2(e.target.value) }}
                  />
                  <Checkbox
                    checked={checked2}
                    onChange={e => { handleChecked(e, 2) }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    style={{ color: 'white' }}
                  />
                </div>
              </Grid>
              <Grid container item xs={8} sm={4} md={4} lg={4} >
                <div className={`${classes.answer}`} style={{ backgroundColor: changeColor(3) }}>
                  <TextField
                    label='Answer3'
                    InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                    value={answer3}
                    onChange={e => { setAnswer3(e.target.value) }}
                  />
                  <Checkbox
                    checked={checked3}
                    onChange={e => { handleChecked(e, 3) }}
                    style={{ color: 'white' }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div>
              </Grid>
              <Grid container item xs={8} sm={4} md={4} lg={4}>
                <div className={`${classes.answer}`} style={{ backgroundColor: changeColor(4) }}>
                  <TextField
                    label='Answer4'
                    InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                    value={answer4}
                    onChange={e => { setAnswer4(e.target.value) }}
                  />
                  <Checkbox
                    checked={checked4}
                    onChange={e => { handleChecked(e, 4) }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    style={{ color: 'white' }}
                  />
                </div>
              </Grid>
              <Grid container item xs={8} sm={4} md={4} lg={4} >
                <div className={`${classes.answer}`} style={{ backgroundColor: changeColor(5) }}>
                  <TextField
                    label='Answer5'
                    InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                    value={answer5}
                    onChange={e => { setAnswer5(e.target.value) }}
                  />
                  <Checkbox
                    checked={checked5}
                    onChange={e => { handleChecked(e, 5) }}
                    style={{ color: 'white' }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div>
              </Grid>
              <Grid container item xs={8} sm={4} md={4} lg={4}>
                <div className={`${classes.answer}`} style={{ backgroundColor: changeColor(6) }}>
                  <TextField
                    label='Answer6'
                    InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                    value={answer6}
                    onChange={e => { setAnswer6(e.target.value) }}
                  />
                  <Checkbox
                    checked={checked6}
                    onChange={e => { handleChecked(e, 6) }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    style={{ color: 'white' }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Dialog>
    </div >
  );
}
export default EditQuestionPage;
