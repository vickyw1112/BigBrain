import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import API_URL from '../constants';
import { useDispatch } from 'react-redux';
import { alertSuccess } from '../redux/actions';
import { Grid, Button, TextField } from '@material-ui/core';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import YouTube from 'react-youtube';

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
const getYouTubeID = require('get-youtube-id');
const useStyles = makeStyles((theme) => ({
  timeWraper: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    color: '#aaa',
  },

  value: {
    fontSize: 40,
  },
  timer: {
    fontFamily: 'Montserrat',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
    padding: theme.spacing(3),
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    flex: 2,
  },
  answers: {
    flex: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answer: {
    width: '100%',
    margin: 10,
    padding: 20,
    fontSize: '18pt',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
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

}));

const GameStart = () => {
  const classes = useStyles();
  const { gameId, sessionId } = useParams();
  // start from first question
  const [position, setPosition] = useState(0);
  const [totalQ, setTotalQ] = useState();
  const [timeLimit, setTimeLimit] = useState(0);
  const [remainTime, setRemainTime] = useState(0);
  const [advanceDisable, setAdvanceDisable] = useState(false);
  const [key, setKey] = useState(0);
  const history = useHistory();
  const [question, setQuestion] = useState({
    answerOption: '',
    title: '',
    imgUrl: null,
    linkUrl: null,
    answers: [],
  });
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [answer5, setAnswer5] = useState('');
  const [answer6, setAnswer6] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`${API_URL}/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then(res => res.json())
      .then(data => {
        const { results } = data;
        setTotalQ(results.questions.length)
        setPosition(results.position);
        if (results.position !== -1 && results.position !== results.questions.length) {
          setQuestion(results.questions[results.position]);
          const now = moment(new Date());
          const qstart = moment(results.isoTimeLastQuestionStarted);
          const qend = qstart.add(
            parseInt(results.questions[results.position].timeLimit),
            'seconds'
          );

          const diff = moment.duration(qend.diff(now)).asSeconds();

          if (diff > 0) {
            setTimeLimit(parseInt(results.questions[results.position].timeLimit));
            setRemainTime(diff);
            setKey(prev => prev + 1);
            setAdvanceDisable(true);
          } else {
            setRemainTime(0);
            setTimeLimit(0);
            setKey(prev => prev + 1);
            setAdvanceDisable(false);
          }
          const answers = results.questions[results.position].answers;
          setAnswer1(answers[0].aBody);
          setAnswer2(answers[1].aBody);
          setAnswer3(answers[2].aBody);
          setAnswer4(answers[3].aBody);
          setAnswer5(answers[4].aBody);
          setAnswer6(answers[5].aBody);
        } else if (results.position === results.questions.length) {
          // TODO
          history.push(`/result/${sessionId}`)
        }
      })
  }, [sessionId, position]);

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className={classes.timer}>Too late...</div>;
    }
    return (
      <div className={classes.timer}>
        <div className={classes.text}>Remaining</div>
        <div className={classes.value}>{remainingTime}</div>
        <div className={classes.text}>seconds</div>
      </div>
    );
  };

  const handleAdvance = () => {
    fetch(`${API_URL}/admin/quiz/${gameId}/advance`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.status);
      })
      .then(data => {
        setPosition(prev => prev + 1);
        dispatch(alertSuccess('Advance success'));
        setAdvanceDisable(true);
      })
      .catch(e => console.log(e));
  }

  let pageContent = null;
  if (position !== totalQ) {
    pageContent = (
      <div className={classes.timeWraper}>
        <Grid container className={classes.content}>
          <Button
            style={{ marginTop: 5, marginBottom: 10 }}
            variant='contained'
            color='primary'
            onClick={handleAdvance}
            disabled={advanceDisable}
          > Next
        </Button>
          <FormControl variant="outlined" className={classes.formControl}>
            <Chip label={question.answerOption} style={{ color: 'white', fontSize: '12pt', backgroundColor: 'green' }} />
          </FormControl>
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
                value={question.title}
                inputProps={{ style: { fontSize: '22pt', textAlign: 'center', lineHeight: 1 } }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} className={classes.body}>
            <CountdownCircleTimer
              key={key}
              isPlaying
              duration={timeLimit}
              initialRemainingTime={remainTime}
              colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}
              onComplete={() => setAdvanceDisable(false)}
            >
              {renderTime}
            </CountdownCircleTimer>
            {(
              (question.imgUrl || question.linkUrl) &&
              <Container maxWidth='md' style={{ marginTop: 10 }}>
                <Typography component="div" style={{
                  border: '2px dashed rgb(216,216,216)',
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {(question.imgUrl &&
                    <img className={classes.img} alt="complex" src={question.imgUrl} />
                  )}
                  {(question.linkUrl &&
                    <YouTube videoId={getYouTubeID(question.linkUrl)} opts={opts} onReady={_onReady} />
                  )}
                </Typography>
              </Container>

            )}
          </Grid>
          <Grid container className={classes.answers} spacing={3}>
            <Grid container item xs={8} sm={4} md={4} lg={4} >
              <div className={`${classes.answer}`} style={{ color: 'white', backgroundColor: '#e21b3c' }}>
                <p>{answer1}</p>
              </div>
            </Grid>
            <Grid container item xs={8} sm={4} md={4} lg={4}>
              <div className={`${classes.answer}`} style={{ color: 'white', backgroundColor: '#1468ce' }}>
                <p>{answer2}</p>
              </div>
            </Grid>
            <Grid container item xs={8} sm={4} md={4} lg={4} >
              <div className={`${classes.answer}`} style={{ color: 'white', backgroundColor: '#d89e00' }}>
                <p>{answer3}</p>
              </div>
            </Grid>
            <Grid container item xs={8} sm={4} md={4} lg={4}>
              <div className={`${classes.answer}`} style={{ color: 'white', backgroundColor: '#26890d' }}>
                <p>{answer4}</p>
              </div>
            </Grid>
            <Grid container item xs={8} sm={4} md={4} lg={4} >
              <div className={`${classes.answer}`} style={{ color: 'white', backgroundColor: '#8e42ff' }}>
                <p>{answer5}</p>
              </div>
            </Grid>
            <Grid container item xs={8} sm={4} md={4} lg={4}>
              <div className={`${classes.answer}`} style={{ color: 'white', backgroundColor: '#1c00ba' }}>
                <p>{answer6}</p>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div >
    );
  }

  return (
    <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid>{pageContent}</Grid>
    </Grid>
  );
}

export default GameStart;
