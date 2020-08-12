import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { EventContext } from '../../contexts/event';
import { UserContext } from '../../contexts/user';

import './index.css';

const HomePage = (props) => {
  const events = useContext(EventContext);
  const user = useContext(UserContext);

  const [eventId, setEventId] = useState(0);

  const lists = events.events;

  const handleClick = () => {
    const event_id = lists[eventId].id;
    user.setUser({
      event_id: event_id
    })
    props.history.push('/login')
  }

  const handleChange = (event) => {
    setEventId(event.target.value);
  }

  return (
    <div className='homepage'>
      <select value={eventId} onChange={handleChange}>
        {
          lists.map(({id, name}, index) => (
            <option value={index} key={index}>{name}</option>
          ))
        }
      </select>
      <div className="btn">
        <button onClick={handleClick}>Next</button>
      </div>
    </div>
  );
}
 
export default withRouter(HomePage);
