import { React, useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';
import { useParams } from 'react-router-dom';
import API_URL from '../constants';
import moment from 'moment';

// const data = [
//   { question: 'Q 1', percentage: 0.8 },
//   { question: 'Q 2', percentage: 0.9 },
//   { question: 'Q 3', percentage: 0.2 },
//   { question: 'Q 4', percentage: 0.4 },
//   { question: 'Q 5', percentage: 0.3 },
// ];
// const players = [
//   { player: 'player 1', score: 100 },
//   { player: 'player 2', score: 200 },
//   { player: 'player 3', score: 50 },
//   { player: 'player 4', score: 1000 },
//   { player: 'player 5', score: 90 }
// ]

const playerData = (player, score) => { return { player, score } };

const useStyles = makeStyles(() => ({
  header: {
    marginLeft: '30px',
    marginTop: '15px',
    marginBottom: '10px',
    border: '0',
    fontFamily: 'Arial'
  },
  scoreBoard: {
    margin: 'auto',
    width: '50%',
    marginBottom: 30,
  },
  barChart: {
    margin: 'auto',
    width: '50%',
  },
  buttonRoot: {
    position: 'fixed',
    bottom: 0,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    '& > *': {
      margin: 'auto',
      marginBottom: '15px',
    },
  },
}));
const GameResult = () => {
  const { sessionId } = useParams();
  const [showScore, setShowScore] = useState(true);
  const [showCorrectness, setShowCorrectness] = useState(false);
  const [showResponseTime, setShowResponseTime] = useState(false);
  const [result, setResult] = useState([]);
  // get all questions of game
  const [questions, setQuestions] = useState([]);

  const showScoreButtonHandler = () => {
    setShowScore(true);
    setShowCorrectness(false);
    setShowResponseTime(false);
  }
  const showCorrectButtonHandler = () => {
    setShowCorrectness(true)
    setShowScore(false);
    setShowResponseTime(false);
  }
  const showResponseTimeHandler = () => {
    setShowResponseTime(true);
    setShowScore(false);
    setShowCorrectness(false);
  }
  const classes = useStyles();

  useEffect(() => {
    fetch(`${API_URL}/admin/session/${sessionId}/results`, {
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
        setResult(data.results);
        return fetch(`${API_URL}/admin/session/${sessionId}/status`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.status);
      })
      .then(data => {
        setQuestions(data.results.questions);
      })
      .catch(e => console.log(e));
  }, []);
  const players = [];
  const right = {};
  const resTime = {};
  const playersNum = result.length;

  // get student and mark
  for (let j = 0; j < result.length; j += 1) {
    const cur = result[j];
    const pn = cur.name;
    let points = 0;

    // calculate players' statistics for each question
    for (let i = 0; i < cur.answers.length; ++i) {
      // console.log(questions[i]);
      // console.log(questions[i].timeLimit);
      // const currTimeLimit = questions[i].timeLimit;
      // console.log('current time limit', currTimeLimit);
      const realAnsweredAt = cur.answers[i].answeredAt === null ? 1000 : cur.answers[i].answeredAt;
      const realStartedAt = cur.answers[i].questionStartedAt === null ? 0 : cur.answers[i].questionStartedAt;
      const answerAt = moment(realAnsweredAt);
      const startAt = moment(realStartedAt);
      const response = moment.duration(answerAt.diff(startAt)).asSeconds();
      // get total response time of each question
      if (!(`Q${i + 1}` in resTime)) {
        resTime[`Q${i + 1}`] = 0;
      }
      resTime[`Q${i + 1}`] += response;
      // get correct rates of each question
      if (cur.answers[i].correct) {
        points += questions[i].points;
        if (!(`Q${i + 1}` in right)) {
          right[`Q${i + 1}`] = 0;
        }
        right[`Q${i + 1}`] += 1;
      } else if (!(`Q${i + 1}` in right)) {
        right[`Q${i + 1}`] = 0;
      }
    }
    players.push(playerData(pn, points));
  }

  const correctRate = Object.entries(right).map(([key, value]) => {
    return Math.round(value / playersNum).toFixed(2);
  })
  const aveTime = Object.entries(resTime).map(([key, value]) => {
    return Math.round(value / playersNum).toFixed(2);
  })

  const data = [];
  for (let i = 0; i < questions.length; ++i) {
    const payload = {
      question: `Q${i + 1}`,
      percentage: Number(correctRate[i]),
      resTime: Number(aveTime[i]),
    }
    data.push(payload);
  }
  console.log(data);

  return (
    <Paper>
      {showScore &&
        <Box >
          <Typography variant="h4" component="h4" className={classes.header}>
            Score board
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.scoreBoard} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((row) => (
                  <TableRow key={row.player}>
                    <TableCell component="th" scope="row">
                      {row.player}
                    </TableCell>
                    <TableCell align="right">
                      {row.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      }
      {
        showCorrectness &&
        <Box>
          <Typography variant="h4" component="h4" className={classes.header}>
            Correctness Statistics
          </Typography>
          <Chart
            data={data}
            className={classes.barChart}
          >
            <ArgumentAxis />
            <ValueAxis max={7} />
            <BarSeries
              valueField="percentage"
              argumentField="question"
            />
            <Animation />
          </Chart>
        </Box>
      }
      {
        showResponseTime &&
        <Box>
          <Typography variant="h4" component="h4" className={classes.header}>
            Average Response Time
          </Typography>
          <Chart
            data={data}
            className={classes.barChart}
          >
            <ArgumentAxis />
            <ValueAxis max={7} />
            <BarSeries
              valueField="resTime"
              argumentField="question"
            />
            <Animation />
          </Chart>
        </Box>
      }
      <Box className={classes.buttonRoot}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button style={{ textTransform: 'none' }} onClick={showScoreButtonHandler}>Score board</Button>
          <Button style={{ textTransform: 'none' }} onClick={showCorrectButtonHandler}> Correctness Percentage</Button>
          <Button style={{ textTransform: 'none' }} onClick={showResponseTimeHandler}>Response Time</Button>
        </ButtonGroup>
      </Box>
    </Paper >
  );
}

export default GameResult
