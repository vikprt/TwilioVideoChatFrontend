import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { UserContext } from '../contexts/user';

const MainRoute = (props) => {
  
  const user =  useContext(UserContext);

  return (
    user.event_id
    ?
      user.loggedIn
      ?
      <Route path={props.path} exact={props.exact} component={props.component} />
      :
      <Redirect to='/login' />
    :
    <Redirect to='/' />
  )
}
 
export default MainRoute;