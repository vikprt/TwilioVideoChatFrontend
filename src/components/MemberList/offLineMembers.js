import React, { useContext } from 'react';
// import CheckedIn from '../CheckedIn';
// import NotChekcedIn from '../NotCheckedIn';
import { UserContext } from '../../contexts/user';

import './index.css';

const OffMemberList = (props) => {
  const { data, onlineUsers, handleVideoChat } = props;

  const user = useContext(UserContext);

  return (
    <React.Fragment>
      {
        !onlineUsers.includes(data.id) &&
        <div className="offmember">
          <p>
            {data.first_name} {data.last_name}
          </p>
          <p>
            {data.job_title}
          </p>
          <p>
            {data.company}
          </p>
        </div>
      }
    </React.Fragment>
  );
}

export default OffMemberList;