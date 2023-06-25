import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './screens/Landing';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import Task from './screens/Task';
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/home/:id" component={Home} />
        <Route path="/task/:taskid" component={Task} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

