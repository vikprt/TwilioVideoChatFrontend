import React, { useContext, useEffect, useState, useCallback } from 'react';
import CheckedIn from '../../components/CheckedIn';
import MemberList from '../../components/MemberList';
// import VideoComponent from '../../components/VideoComponent';
import { faLink, faAngleDoubleRight, faAngry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import { UserContext } from '../../contexts/user';
import { EventContext } from '../../contexts/event';

import socketio from 'socket.io-client';

import { getToken } from "../../services/index";
import Room from "../../components/Room/index";

import './index.css';
// import { isCompositeComponent } from 'react-dom/test-utils';

const socket = socketio.connect('http://localhost:8080');

const MainPage = () => {

  const user = useContext(UserContext);
  const events = useContext(EventContext);

  const users = events.users;

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [videoState, setVideoState] = useState(false);
  const [showEmotion, setShowEmotion] = useState(false);
  const [senderName, setSenderName] =  useState("");
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({sender: user.user.id, text: ""});

  const [chatFlag, setChatFlag] = useState(false);

  useEffect(() => {
    socket.emit("init", {
      id: user.user.id
    });

    socket.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });

    socket.on("ping", () => {
      socket.emit("init", {id: user.user.id});
    });

    socket.on("askVideoChat", (data) => {
      const sender = data.sender;
      const receiver = data.receiver;

      if (receiver == user.user.id) {
        setSenderName(sender, setVideoState(true));
      }
    });

    socket.on("allowVideoChat", (data) => {
      if (data.sender == user.user.id) {
        startVideoChat(data.sender, data.receiver);
      }
    });

    return function cleanup() {
      socket.disconnect();
    }
  }, []);

  const handleMessageText = (event) => {
    setMessage({sender: user.user.id, text: event.target.value});
  }

  const addEmoji = e => {
    let emoji = e.native;
    setMessage({sender: user.user.id, text: message.text + emoji})
  }

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      if (data.room == roomName) {
        setMessages(prev => [...prev, data.message]);
      }
    })
  }, [roomName]);

  const sendMessage = () => {
    if (roomName == "") return;
    socket.emit("sendMessage", {room: roomName, message: message});
    setMessage({sender: user.user.id, text: ""})
  }

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  }

  const askVideoChat = (sender, receiver) => {
    socket.emit("askVideoChat", {sender: sender, receiver: receiver});
  };

  const rejectVideoChat = () => {
    setVideoState(false, setSenderName(""));
  }

  const startVideoChat = (sender, receiver) => {
    const room = sender + "vs" + receiver;
    getToken({
      identity: sender,
      room: room
    }).then(res => {
      setRoomName(room, setToken(res.token));
    });
  }

  const startVideoChat2 = (sender, receiver) => {
    const room = sender + "vs" + receiver;
    getToken({
      identity: receiver,
      room: room
    }).then(res => {
      setRoomName(room, setToken(res.token));
    });
  }

  const allowVideoChat = () => {
    socket.emit("allowVideoChat", {
      sender: senderName,
      receiver: user.user.id
    });
    startVideoChat2(senderName, user.user.id);
    setVideoState(!videoState);
  }

  const handleVideoChat = (receiver) => {
    askVideoChat(user.user.id, receiver);
  };

  const handleLogout = useCallback(event => {
    setToken(null);
  }, []);

  return (
    <div className='main'>
      {
        videoState ?
        <div className="modal">
          <div className="modal-body">
            <p>{senderName} is asking a video chat...</p>
            <button  className="success" onClick={allowVideoChat}>Allow</button>
            <button className="danger" onClick={rejectVideoChat}>Reject</button>
          </div>
        </div>
        : <div>no request</div>
      }
      <div className="stage">
        <div className='video-section'>
          {
            token ?
            <Room roomName={roomName} token={token} handleLogout={handleLogout} />
            : <div className="video-empty-area"></div>
          }
        </div>
        <div className="message" style={{color: "white"}}>
          <div className="message-body">
          {
            messages.map((message, index) => {
              return (
                <div className={message.sender === user.user.id ? 'message-block right' : 'message-block'} key={index}>
                  {/* <p>{message.sender}</p> */}
                  {message.sender !== user.user.id && <img src="https://i1.wp.com/bestpakistan.pk/wp-content/uploads/2017/11/7f796d57218d9cd81a92d9e6e8e51ce4-free-avatars-online-profile.jpg?fit=736%2C736&ssl=1" />}
                  <span className={message.sender === user.user.id ? 'from' : 'to'}>{message.text}</span>
                  {message.sender === user.user.id && <img src="https://i1.wp.com/bestpakistan.pk/wp-content/uploads/2017/11/7f796d57218d9cd81a92d9e6e8e51ce4-free-avatars-online-profile.jpg?fit=736%2C736&ssl=1" />}
                </div>
              )
            })
          }
          </div>
          <div className="message-control">
            <FontAwesomeIcon icon={faLink} size="1x" />
            <input type="text" value={message.text} onChange={handleMessageText} onKeyDown={onKeyDown}/>
            <span className="send-icon" onClick={sendMessage}><FontAwesomeIcon icon={faAngleDoubleRight} /></span>
            <span className="emotion" onClick={() => setShowEmotion(!showEmotion)}><FontAwesomeIcon icon={faAngry} /></span>
            { showEmotion &&
              <span className="emotion-list" ><Picker onSelect={addEmoji} width="280px"/></span>
            }
          </div>
        </div>
      </div>
      <div className="title">
        SPEAKER CHECK-IN-VIDEO & TEXT CHAT
      </div>
      <div className="checked-in-status">
        <div className="checked-in">
          <CheckedIn />
          <p>
            Online
          </p>
        </div>
      </div>
      <div className="members">
        {
          users.map((data, index) =>
            <MemberList
              key={index}
              data={data}
              onlineUsers={onlineUsers}
              handleVideoChat={handleVideoChat}
            />
          )
        }
      </div>
    </div>
  );
}

export default MainPage;