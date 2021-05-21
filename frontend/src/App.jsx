import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import LoginPage from './pages/login';
import NavBar from './components/navbar';
import SignupPage from './pages/signup';
import Dashboard from './pages/dashboard';
import { useSelector } from 'react-redux'
import CustomizedSnackbars from './components/alert';
import EditGame from './pages/editGame';
import GameResult from './pages/gameResult';
import EditQuestionPage from './pages/editQuestionPage';
import GameJoin from './pages/gameJoin';
import HostGame from './pages/hostGame';
import PlayGame from './pages/playerGamePlay';
import GameStart from './pages/gameStart';
import PlayerResult from './pages/playerResult';

export const App = () => {
  // for alert
  const alert = useSelector(state => state.alert);
  return (
    <div>
      <Router>
        {(alert.message &&
          <CustomizedSnackbars type={alert.type} message={alert.message} />
        )}
        <NavBar />
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/signup">
            <SignupPage />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/dashboard/:gameId">
            <EditGame />
          </Route>
          <Route exact path='/dashboard/:gameId/:questionId'>
            <EditQuestionPage />
          </Route>
          <Route exact path='/result/:sessionId'>
            <GameResult />
          </Route>
          <Route exact path='/player/result/:playerId'>
            <PlayerResult />
          </Route>
          <Route exact path='/playground/:sessionId'>
            <GameJoin />
          </Route>
          <Route exact path='/hostgame/:gameId/:sessionId'>
            <HostGame />
          </Route>
          <Route exact path='/gamestart/:gameId/:sessionId'>
            <GameStart />
          </Route>
          <Route exact path='/playground/:sessionId/:playerId'>
            <PlayGame />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </div >
  );
}

export default App;
