import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Grid, TextField } from '@material-ui/core'
import API_URL from '../constants';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useDispatch } from 'react-redux';
import { alertSuccess, alertFailure } from '../redux/actions';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 200,
  },
  answers: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
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
}));

const PlayGame = () => {
  // status can only have:
  // game not start
  // game start
  // question start
  // question end
  // game end
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [gameStatus, setGameStatus] = useState(
    { cur: 'game not start' }
  );
  const { playerId } = useParams();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);
  const [answers, setAnswers] = useState([
    { isCorrect: false },
    { isCorrect: false },
    { isCorrect: false },
    { isCorrect: false },
    { isCorrect: false },
    { isCorrect: false },
  ]);
  const [answer1Text, setAnswer1Text] = useState('Answer 1');
  const [answer2Text, setAnswer2Text] = useState('Answer 2');
  const [answer3Text, setAnswer3Text] = useState('Answer 3');
  const [answer4Text, setAnswer4Text] = useState('Answer 4');
  const [answer5Text, setAnswer5Text] = useState('Answer 5');
  const [answer6Text, setAnswer6Text] = useState('Answer 6');

  let questionEndTimer = null;
  let getQuestionInterval = null;
  let getGameStatusInterval = null;
  let answerEndTimer = null;
  const [key, setKey] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [remainTime, setRemainTime] = useState(0);

  useEffect(() => {
    // polling game status from server
    const getGameStatus = () => {
      fetch(`${API_URL}/play/${playerId}/status`, {
        method: 'GET',
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(res.status);
        })
        .then(data => {
          if (data.started === true) {
            setGameStatus({
              cur: 'question start',
            });
          } else {
            setGameStatus({
              cur: 'game not start',
            })
          }
        })
        .catch(e => console.log(e));
    };

    const getQuestion = () => {
      fetch(`${API_URL}/play/${playerId}/question`, {
        method: 'GET',
      }).then(res => {
        if (res.ok) {
          return Promise.resolve(res.json());
        }
        return Promise.resolve(res.json()).then(data => {
          return Promise.reject(data.error);
        })
      }).then(data => {
        const { question } = data;
        const prevQid = localStorage.getItem('qid');
        if (prevQid !== question.id || prevQid === null) {
          setAnswers(data.question.answers);
          setAnswer1Text(question.answers[0].aBody);
          setAnswer2Text(question.answers[1].aBody);
          setAnswer3Text(question.answers[2].aBody);
          setAnswer4Text(question.answers[3].aBody);
          setAnswer5Text(question.answers[4].aBody);
          setAnswer6Text(question.answers[5].aBody);
          setGameStatus(prev => ({
            cur: 'question start',
          }));

          const now = moment(new Date());
          const qstart = moment(question.isoTimeLastQuestionStarted);
          const qend = qstart.add(
            parseInt(question.timeLimit),
            'seconds'
          );

          const diff = moment.duration(qend.diff(now)).asSeconds();

          if (diff > 0) {
            setTimeLimit(parseInt(question.timeLimit));
            setRemainTime(diff);
            setKey(prev => prev + 1);
            answerEndTimer = setTimeout(() => {
              const answerIds = [];
              if (checked1) {
                answerIds.push(answers[0].aid);
              }
              if (checked2) {
                answerIds.push(answers[1].aid);
              }
              if (checked3) {
                answerIds.push(answers[2].aid);
              }
              if (checked4) {
                answerIds.push(answers[3].aid);
              }
              if (checked5) {
                answerIds.push(answers[4].aid);
              }
              if (checked6) {
                answerIds.push(answers[5].aid);
              }
              console.log(answerIds);
              fetch(`${API_URL}/play/${playerId}/answer`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answerIds }),
              }).then(res => {
                if (res.ok) {
                  return Promise.resolve(res.json());
                }
                return Promise.resolve(res.json()).then(d => {
                  return Promise.reject(d.error);
                });
              }).then(
                () => {
                  dispatch(alertSuccess('add answer success'));
                }, (error) => {
                  dispatch(alertFailure('add answer not success'))
                  console.log(error);
                }
              )
            }, (diff - 2) * 1000);

            questionEndTimer = setTimeout(() => {
              localStorage.setItem('qid', question.id);
              setChecked1(false);
              setChecked2(false);
              setChecked3(false);
              setChecked4(false);
              setChecked5(false);
              setChecked6(false);

              setGameStatus({
                cur: 'question end',
              });
            }, (diff + 1) * 1000);
          }
        } else if (prevQid !== null && prevQid === question.id) {
          // waiting for admin to advance
          setGameStatus({
            cur: 'question end',
          });
        }
        // have a new question now
        if (prevQid !== null && prevQid !== question.id) {
          clearInterval(getQuestionInterval);
          getQuestionInterval = null;
          localStorage.removeItem('qid');
          setGameStatus({
            cur: 'question start',
          });
        }
      }, error => {
        console.log(error);
        localStorage.removeItem('qid');
        setGameStatus({
          cur: 'game end',
        });

        // fetch game result here
        history.push(`/player/result/${playerId}`);
      });
    };

    if (gameStatus.cur === 'game not start') {
      getGameStatusInterval = setInterval(() => {
        getGameStatus();
      }, 1000);
    } else if (gameStatus.cur === 'question start') {
      getQuestion();
    } else if (gameStatus.cur === 'question end') {
      getQuestionInterval = setInterval(() => {
        getQuestion();
      }, 1000);
    }
    return () => {
      clearTimeout(questionEndTimer);
      clearTimeout(answerEndTimer);
      clearInterval(getQuestionInterval);
      clearInterval(getGameStatusInterval);
    };
  }, [playerId, gameStatus, checked1, checked2, checked3, checked4, checked5, checked6]);

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

  let pageContent = null;

  if (gameStatus.cur === 'game not start') {
    pageContent = (
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <h2>  Game not started yet, please wait... </h2>
      </div>
    );
  } else if (gameStatus.cur === 'question end') {
    pageContent = (
      <div>
        <h2 style={{ margin: 10 }}>Correct answers are:</h2>
        <Grid container className={classes.answers} spacing={2}>
          {(answers[0].isCorrect &&
            <Grid container item xs={8} sm={4} md={4} lg={4} >
              <div className={`${classes.answer}`} style={{ backgroundColor: '#e21b3c' }}>
                <TextField
                  label='Answer1'
                  disabled={true}
                  InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                  value={answer1Text}
                />
              </div>
            </Grid>
          )}
          {(answers[1].isCorrect &&
            <Grid container item xs={8} sm={4} md={4} lg={4}>
              <div className={`${classes.answer}`} style={{ backgroundColor: '#1468ce' }}>
                <TextField
                  label='Answer2'
                  disabled={true}
                  InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                  value={answer2Text}
                />
              </div>
            </Grid>
          )}
          {(answers[2].isCorrect &&
            <Grid container item xs={8} sm={4} md={4} lg={4} >
              <div className={`${classes.answer}`} style={{ backgroundColor: '#d89e00' }}>
                <TextField
                  label='Answer3'
                  disabled={true}
                  InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                  value={answer3Text}
                />
              </div>
            </Grid>
          )}
          {(answers[3].isCorrect &&
            <Grid container item xs={8} sm={4} md={4} lg={4}>
              <div className={`${classes.answer}`} style={{ backgroundColor: '#26890d' }}>
                <TextField
                  label='Answer4'
                  disabled={true}
                  InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                  value={answer4Text}
                />
              </div>
            </Grid>
          )}

          {(answers[4].isCorrect &&
            <Grid container item xs={8} sm={4} md={4} lg={4} >
              <div className={`${classes.answer}`} style={{ backgroundColor: '#8e42ff' }}>
                <TextField
                  label='Answer5'
                  disabled={true}
                  InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                  value={answer5Text}
                />
              </div>
            </Grid>
          )}

          {(answers[5].isCorrect &&
            <Grid container item xs={8} sm={4} md={4} lg={4}>
              <div className={`${classes.answer}`} style={{ backgroundColor: '#1c00ba' }}>
                <TextField
                  label='Answer6'
                  disabled={true}
                  InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                  value={answer6Text}
                />
              </div>
            </Grid>

          )}
        </Grid>
      </div>
    );
  } else if (gameStatus.cur === 'question start') {
    pageContent = (
      <div>
        <Grid container className={classes.answers} spacing={2}>
          <Grid container item xs={8} sm={4} md={4} lg={4} >
            <div className={`${classes.answer}`} style={{ backgroundColor: '#e21b3c' }}>
              <TextField
                label='Answer1'
                disabled={true}
                InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                value={answer1Text}
              />
              <Checkbox
                checked={checked1}
                onChange={(e) => { setChecked1(e.target.checked) }}
                style={{ color: 'white' }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
          </Grid>
          <Grid container item xs={8} sm={4} md={4} lg={4}>
            <div className={`${classes.answer}`} style={{ backgroundColor: '#1468ce' }}>
              <TextField
                label='Answer2'
                disabled={true}
                InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                value={answer2Text}
              />
              <Checkbox
                checked={checked2}
                onChange={(e) => { setChecked2(e.target.checked) }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                style={{ color: 'white' }}
              />
            </div>
          </Grid>
          <Grid container item xs={8} sm={4} md={4} lg={4} >
            <div className={`${classes.answer}`} style={{ backgroundColor: '#d89e00' }}>
              <TextField
                label='Answer3'
                disabled={true}
                InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                value={answer3Text}
              />
              <Checkbox
                checked={checked3}
                onChange={(e) => { setChecked3(e.target.checked) }}
                style={{ color: 'white' }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
          </Grid>
          <Grid container item xs={8} sm={4} md={4} lg={4}>
            <div className={`${classes.answer}`} style={{ backgroundColor: '#26890d' }}>
              <TextField
                label='Answer4'
                disabled={true}
                InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                value={answer4Text}
              />
              <Checkbox
                checked={checked4}
                onChange={(e) => { setChecked4(e.target.checked) }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                style={{ color: 'white' }}
              />
            </div>
          </Grid>
          <Grid container item xs={8} sm={4} md={4} lg={4} >
            <div className={`${classes.answer}`} style={{ backgroundColor: '#8e42ff' }}>
              <TextField
                label='Answer5'
                disabled={true}
                InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                value={answer5Text}
              />
              <Checkbox
                checked={checked5}
                onChange={(e) => { setChecked5(e.target.checked) }}
                style={{ color: 'white' }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
          </Grid>
          <Grid container item xs={8} sm={4} md={4} lg={4}>
            <div className={`${classes.answer}`} style={{ backgroundColor: '#1c00ba' }}>
              <TextField
                label='Answer6'
                disabled={true}
                InputProps={{ style: { color: 'white', fontSize: '1.5rem' } }}
                value={answer6Text}
              />
              <Checkbox
                checked={checked6}
                onChange={(e) => { setChecked6(e.target.checked) }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                style={{ color: 'white' }}
              />
            </div>
          </Grid>
          <CountdownCircleTimer
            key={key}
            isPlaying
            duration={timeLimit}
            initialRemainingTime={remainTime}
            colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}
            onComplete={() => { }}
          >
            {renderTime}
          </CountdownCircleTimer>
        </Grid>
      </div>
    );
  }
  return pageContent;
};
export default PlayGame;
