import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { UserContext } from '../contexts/user';
import { EventContext } from '../contexts/event';

const AuthRoute = (props) => {

  const user =  useContext(UserContext);
  const events = useContext(EventContext);

  return (
    user.event_id
    ?
    <Route path={props.path} exact={props.exact} component={props.component} />
    :
    <Redirect to='/' />
  )
}

export default AuthRoute;