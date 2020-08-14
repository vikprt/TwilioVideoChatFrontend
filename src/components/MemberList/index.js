import React, { useContext } from 'react';
import CheckedIn from '../CheckedIn';
import NotChekcedIn from '../NotCheckedIn';
import { UserContext } from '../../contexts/user';

import './index.css';

const MemberList = (props) => {
  const { data, onlineUsers, handleVideoChat } = props;

  const user = useContext(UserContext);

  console.log('data', onlineUsers);

  return (
    <div className="member">
      { onlineUsers.includes(data.id) && <CheckedIn /> }
      {
        onlineUsers.includes(data.id) &&
        <div className="member_box">
          <div>
            <div className="profile_img">
              <img src={data.profile_picture ? data.profile_picture : 'https://i1.wp.com/bestpakistan.pk/wp-content/uploads/2017/11/7f796d57218d9cd81a92d9e6e8e51ce4-free-avatars-online-profile.jpg?fit=736%2C736&ssl=1'} alt="Profile" />
            </div>
            <div className="member_info">
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
          </div>
          {
          onlineUsers.includes(data.id) && user.user.id != data.id
          ?
          <div>
            <button className="online-user-btn">Text Chat</button>
            <button className="online-user-btn" onClick={() => handleVideoChat(data.id)}>Video Chat</button>
          </div>
          :
          <div>
            <button className="offline-user-btn" disabled={true}>Text Chat</button>
            <button className="offline-user-btn" disabled={true}>Video Chat</button>
          </div>
        }

        </div>

      }

    </div>
  );
}

export default MemberList;