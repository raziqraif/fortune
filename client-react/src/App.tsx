import React from 'react';
import {
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

import Landing from './landing';
import Profile from './profile/Profile';

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
            <Route path="/global" render={({match, history}) => {
              return <Game gameId={match.params.gameId} history={history}/>
            }} />
            <Route path="/game/:gameId" render={({match, history}) => {
              return <Game gameId={match.params.gameId} history={history}/>
            }} />
            <Route exact path="/" component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/play" component={Play} />
            <Route path="/create" component={CreateGame} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/profile/:profileId" render={({match}) => {
              return <Profile profileId={match.params.profileId}/>
            }}/>
            <Route render={({match}) => {
              return <Redirect to="/"/>
            }} />
          </Switch>
        </div>
    </div>
  );
}

export default App;
