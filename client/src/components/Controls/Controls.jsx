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
    // leave video call notification.

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
    // leave room notification.

    event.preventDefault();
    if (window.confirm("Are you sure ? You will leave the room.")) {
      endCall();
      props.history.push(`/`);
    }
  }

  if (inVideo) {
    return (
      // the control buttons if the user is in video call.
      <div className="control">
        {/* Toggle Chat */}
        <div className="control__button">
          <IconButton onClick={toggleDrawer}>
            <ForumIcon className="control__icon" />
          </IconButton>
        </div>

        {/* Audio toggle */}
        <div className="control__button">
          <IconButton onClick={audioToggle}>
            {audioState ? (
              <MicRoundedIcon className="control__icon" />
            ) : (
              <MicOffRoundedIcon className="control__icon" />
            )}
          </IconButton>
        </div>

        {/* Video Toggle */}
        <div className="control__button">
          <IconButton onClick={videoToggle}>
            {videoState ? (
              <VideocamRoundedIcon className="control__icon" />
            ) : (
              <VideocamOffRoundedIcon className="control__icon" />
            )}
          </IconButton>
        </div>

        {/* End Call button */}
        <div className="control__button">
          <IconButton onClick={leaveVideoCall}>
            <CallEndIcon className="control__icon" />
          </IconButton>
        </div>
      </div>
    );
  } else {
    return (
      // control button if the user is not in video call, ie just in chat room.
      <div className="control">
        {/* Join conference */}
        <div className="control__button">
          <Link style={{ textDecoration: "none" }} to={`/preview`}>
            <IconButton>
              <VideoCallIcon className="control__icon" />
            </IconButton>
          </Link>
        </div>

        {/* Leave Room */}
        <div className="control__button">
          <IconButton onClick={leaveCall}>
            <ExitToAppIcon className="control__icon" />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default Controls;
