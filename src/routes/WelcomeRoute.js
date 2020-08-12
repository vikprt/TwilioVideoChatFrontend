import React, { useContext, useEffect } from 'react';
import { Route } from 'react-router-dom';

import { UserContext } from '../contexts/user';
import { EventContext } from '../contexts/event';

const WelcomeRoute = (props) => {

  const user =  useContext(UserContext);
  const events = useContext(EventContext);

  useEffect(() => {
    user.setUser({
      user: null,
      event_id: null,
      loggedIn: false
    });
    events.setEvent({
      users: []
    });
  }, [])

  return (
    <Route path={props.path} exact={props.exact} component={props.component} />
  )
}

export default WelcomeRoute;