import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "../Participant/index";
import { first } from "lodash";

import { faMicrophone, faVideo, faDesktop, faPhoneSlash } from '@fortawesome/free-solid-svg-icons'
import Icon from "./Icon";

import "./index.css";

const Room = ({
    roomName,
    token,
    handleLogout
}) => {
    const [room, setRoom] = useState(null);
    const [screenTrack, setScreenTrack] = useState(null);
    const [participants, setParticipants] = useState([]);

    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);

    const handleMic = () => {
        const publications = room.localParticipant.audioTracks;

        publications.forEach(publication => {
            if (!micEnabled) publication.track.enable();
            else publication.track.disable();
        });

        setMicEnabled(!micEnabled);
    }

    const handleCamera = () => {
        const publications = room.localParticipant.videoTracks;

        publications.forEach(publication => {
            if (!cameraEnabled) publication.track.enable();
            else publication.track.disable();
        });

        setCameraEnabled(!cameraEnabled);
    }

    const handleScreen = () => {
        createScreenTrack(100, 100);
    }

    const createScreenTrack = (height, width) => {
        if (typeof navigator === 'undefined'
            || !navigator.mediaDevices
            || !navigator.mediaDevices.getDisplayMedia) {
            return Promise.reject(new Error('getDisplayMedia is not supported'));
        }
        return navigator.mediaDevices.getDisplayMedia({
            video: {
            height: height,
            width: width,
            mediaSource: 'screen'
            }
        }).then(function(stream) {
            const newStream =  new Video.LocalVideoTrack(first(stream.getVideoTracks()));
            room.localParticipant.publishTrack(newStream);
            setParticipants(prevParticipants => [...prevParticipants, room.localParticipant]);
        });
    }

    useEffect(() => {
        const participantConnected = participant => {
            setParticipants(prevParticipants => [...prevParticipants, participant]);
        };
        const participantDisconnected = participant => {
            setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
        };

        Video.connect(token, {
            name: roomName,
            audio: true,
            video: { width: 600, height: 400 }
        }).then(room => {
            setRoom(room);
            room.on("participantConnected", participantConnected);
            room.on("participantDisconnected", participantDisconnected);
            room.participants.forEach(participantConnected);
        });

        return () => {
            setRoom(currentRoom => {
                if (currentRoom && currentRoom.localParticipant.state === "connected") {
                    currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
                        trackPublication.track.stop();
                    });
                    currentRoom.disconnect();
                    return null;
                } else {
                    return currentRoom;
                }
            });
        }
    }, [roomName, token]);

    let remoteParticipants = participants.map(participant => (
        <Participant key={participant.sid} isMuted={!micEnabled} participant={participant} />
    ));

    remoteParticipants = remoteParticipants[remoteParticipants.length - 1];

    return (
        <div className="video-container">
            <div className="video-body">
                <div className="local-participant">
                    {room ? (
                        <Participant
                            key={room.localParticipant.sid}
                            isMuted={!micEnabled}
                            participant={room.localParticipant}
                        />
                    ) : (
                        ''
                    )}
                </div>
                <div className="remote-participants">{remoteParticipants}</div>
            </div>
            <div className="video-control">
                <div className={ micEnabled ? 'video-control-icon' : 'video-control-icon block' }>
                    <Icon icon={faMicrophone} onClick={handleMic} />
                </div>
                <div className={ cameraEnabled ? 'video-control-icon' : 'video-control-icon block' }>
                    <Icon icon={faVideo} onClick={handleCamera} />
                </div>
                <div className="video-control-icon">
                    <Icon icon={faDesktop} onClick={handleScreen} />
                </div>
                <div className="video-control-icon block">
                    <Icon icon={faPhoneSlash} onClick={handleLogout} />
                </div>
            </div>
        </div>
    );
};

export default Room;