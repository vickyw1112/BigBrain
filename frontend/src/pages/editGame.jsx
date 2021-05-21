import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import NewQuestion from '../components/newQuestion';
import { useParams } from 'react-router-dom'
import QuestionCard from '../components/questionCard';
import API_URL from '../constants';
import uuid from 'react-uuid';

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
}));
const EditGame = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { gameId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleIsEdit = () =>
    setIsEdit(preState => !preState);

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
        setQuestions(data.questions);
        console.log(questions)
      })
      .catch(e => { console.log(e) });
  }, [open, gameId, isEdit])
  return (
    <div className={classes.root}>
      <Grid container item xs={12} justify='flex-end' className={classes.buttonWrap}>
        <Button
          className={classes.button}
          variant='contained' color='primary'
          onClick={handleClickOpen}
          data-test-target='AddGameQuestionButton'
        >Add A New Quesstion
              <AddBoxIcon className={classes.actionIcon} />
        </Button>
      </Grid>
      <Grid container className={classes.cardsContainer} item spacing={4}>
        {questions.map(question => {
          return (
            <Grid item xs={12} key={uuid()}>
              <QuestionCard
                id={gameId}
                title={question.answerOption}
                description={question.title}
                time={parseInt(question.timeLimit)}
                choices={question.answers}
                image={question.imgUrl}
                link={question.linkUrl}
                qid={question.id}
                handleIsEdit={handleIsEdit}
              />
            </Grid>
          );
        })}
      </Grid>
      <NewQuestion id={gameId} open={open} handleClose={handleClose} />
    </div >
  );
}
export default EditGame;
