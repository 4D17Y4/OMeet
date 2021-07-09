import React, { useContext } from "react";
import MicOffRoundedIcon from "@material-ui/icons/MicOffRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import VideocamOffRoundedIcon from "@material-ui/icons/VideocamOffRounded";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ForumIcon from "@material-ui/icons/Forum";
import { Link } from "react-router-dom";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { SocketContext } from "../../SocketContext.js";
import IconButton from "@material-ui/core/IconButton";
import "./Controls.css";
import { initializeIcons } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";

initializeIcons();

function Controls({ props, inVideo, toggleDrawer }) {
  const {
    endCall,
    audioState,
    videoState,
    roomID,
    audioToggle,
    videoToggle,
    endVideoCall,
  } = useContext(SocketContext);

  function leaveVideoCall(event) {
    event.preventDefault();
    if (
      window.confirm(
        "Are you sure ? You will leave the video room and will be redirected to the chat."
      )
    ) {
      endVideoCall();
      props.history.push(`/chat/${roomID}`);
    }
  }

  function leaveCall(event) {
    event.preventDefault();
    if (window.confirm("Are you sure ? You will leave the room.")) {
      endCall();
      props.history.push(`/`);
    }
  }

  if (inVideo) {
    return (
      <div className="control">
        <div className="control__button">
          <IconButton>
            <ForumIcon
              onClick={toggleDrawer}
              className="control__icon"
              fontSize="large"
            />
          </IconButton>
        </div>
        <div className="control__button">
          <IconButton>
            {audioState ? (
              <MicRoundedIcon
                onClick={audioToggle}
                className="control__icon"
                fontSize="large"
              />
            ) : (
              <MicOffRoundedIcon
                onClick={audioToggle}
                className="control__icon"
                fontSize="large"
              />
            )}
          </IconButton>
        </div>
        <div className="control__button">
          <IconButton>
            {videoState ? (
              <VideocamRoundedIcon
                onClick={videoToggle}
                className="control__icon"
                fontSize="large"
              />
            ) : (
              <VideocamOffRoundedIcon
                onClick={videoToggle}
                className="control__icon"
                fontSize="large"
              />
            )}
          </IconButton>
        </div>
        <div className="control__button">
          <Link style={{ textDecoration: "none" }} onClick={leaveVideoCall}>
            <IconButton>
              <CallEndIcon className="control__icon" fontSize="large" />
            </IconButton>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="control">
        <div className="control__button">
          <Link style={{ textDecoration: "none" }} to={`/preview`}>
            <IconButton>
              <VideoCallIcon className="control__icon" fontSize="large" />
            </IconButton>
          </Link>
        </div>
        <div className="control__button">
          <IconButton onClick={leaveCall}>
            <ExitToAppIcon className="control__icon" fontSize="large" />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default Controls;
