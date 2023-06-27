import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './screens/Landing';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import Task from './screens/Task';
import AddProject from './screens/AddProject';
import Dashboard from './screens/Dashboard';
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/home/:id" component={Home} />
        <Route path="/task/:taskid" component={Task} />
        <Route path="/addProject" component={AddProject} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

