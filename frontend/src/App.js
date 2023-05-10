import './App.css';
import React from "react";
import { Route, Switch,} from "react-router-dom";
import Home from "./components/Home"
import Player from './components/Player';
import ipConfig from "./ipConfig.json";
// https://xflix-backend-node.herokuapp.com https://vidserver.azurewebsites.net
export const config = {
  endpoint: "https://xflix-node.vercel.app",
  vidEndpoint: `https://vidserver.azurewebsites.net`
};
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/preview/:id" component={Player}>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

    </div>
  );
}

export default App;
