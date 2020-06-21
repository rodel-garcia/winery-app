import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import WineList from './WineList';
import WineDetail from './WineDetail';

const App = () => {
  return (
    <div className='ui container'>
      <Switch>
        <Route path='/wines' component={WineList} exact={true} />
        <Route path='/wines/:lotCode' component={WineDetail} />
        <Redirect to='/wines' />
      </Switch>
    </div>
  );
};

export default App;
