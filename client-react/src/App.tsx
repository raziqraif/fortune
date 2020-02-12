import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as H from 'history';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './menubar';
import Game from './game/Game';


interface MatchParams {
  gameId?: string;
}

function App() {
  return (
    <div className="App">
      <Router>
        <MenuBar />
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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
