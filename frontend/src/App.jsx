import './App.css';
import React from "react";
import { Route, Switch, BrowserRouter as Router} from "react-router-dom";
import Home from "./components/Home"
import Player from './components/Player';
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `https://xflix-backend-node.herokuapp.com`,
};
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/preview/:id" component={Player}>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>

      </Router>

    </div>
  );
}

export default App;
