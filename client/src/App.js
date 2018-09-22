import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./pages/Register";
import Test from "./pages/Test";

const App = () => (
  <Router>
    <div className="main-page p-3 mx-auto">
      <Switch>
        <Route exact path="/" component={Register} />
        <Route exact path="/test" component={Test} />
      </Switch>
    </div>
  </Router>
);

export default App;
