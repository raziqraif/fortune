import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuBar from './menubar';
import Game, { CreateGame } from './game';
import Login from './login';
import Play from './play';
import Register from './register';
import Notifications from './notifications';


interface MatchParams {
  gameId?: string;
}

function App() {
  return (
    <div className="App">
        <ToastContainer/>
        <MenuBar />
        <div className="container">
          <Switch>
            <Route path="/global" render={({match}) => {
              return <Game gameId={match.params.gameId} />
            }} />
            <Route path="/game/:gameId" render={({match}) => {
              return <Game gameId={match.params.gameId} />
            }} />
            <Route exact path="/" render={({match}) => {
              return <Game gameId={match.params.gameId} />
            }} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/play" component={Play} />
            <Route path="/create" component={CreateGame} />
            <Route path="/notifications" component={Notifications} />
            <Route render={({match}) => {
              return <Redirect to="/"/>
            }} />
          </Switch>
        </div>
    </div>
  );
}

export default App;
