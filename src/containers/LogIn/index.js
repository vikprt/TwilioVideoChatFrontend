import React, { useState, useContext, useEffect } from 'react';
import { EventContext } from '../../contexts/event';
import { UserContext } from '../../contexts/user';

import { getEventsMembers } from '../../services/index';

import './index.css';

const LogIn = (props) => {
  const events = useContext(EventContext);
  const user = useContext(UserContext);

  const [email, setEmail] = useState('');

  useEffect(() => {
    getEventsMembers(user.event_id)
    .then(res => {
      events.setEvent({
        users: res.lists
      })
    })
    .catch(err => console.log(err))
  })

  const handleChange = (event) => {
    setEmail(event.target.value)
  }

  const login = (event) => {
    event.preventDefault();
    let obj = events.users.find(o => o.email === email);
    // console.log(events.users)
    if(obj) {
      user.setUser({
        user: obj,
        loggedIn: true,
      })
      props.history.push('/room')
    }
    else {
      alert('You are not registered in this event!')
    }
  }

  return (
    <div className="login">
      <form onSubmit={login}>
        <input type="email" name="email" value={email} onChange={handleChange} required/>
        <div className="btn">
          <button>LogIn</button>
        </div>
      </form>
    </div>
  );
}

export default LogIn;