import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './screens/Landing';
import Home from './screens/Home';
import Task from './screens/Task';
import AddProject from './screens/AddProject';
import Dashboard from './screens/Dashboard';
import Room from './screens/Room';
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/home/:id" component={Home} />
        <Route path="/task/:taskid" component={Task} />
        <Route path="/addProject" component={AddProject} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/room/:roomid" component={Room}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;

