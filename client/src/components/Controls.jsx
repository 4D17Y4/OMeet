import React, { useContext } from "react";
import MicOffRoundedIcon from "@material-ui/icons/MicOffRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import VideocamOffRoundedIcon from "@material-ui/icons/VideocamOffRounded";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ForumIcon from "@material-ui/icons/Forum";
import { SocketContext } from "../SocketContext.js";
import IconButton from "@material-ui/core/IconButton";
import "./Controls.css";
function Controls() {
  const { audioState, videoState, audioToggle, videoToggle } =
    useContext(SocketContext);

  return (
    <div className="controls">
      <div className="icon">
        <IconButton className="icon">
          {audioState ? (
            <MicRoundedIcon
              onClick={audioToggle}
              className="controls__icon"
              fontSize="large"
            />
          ) : (
            <MicOffRoundedIcon
              onClick={audioToggle}
              className="controls__icon"
              fontSize="large"
            />
          )}
        </IconButton>
      </div>
      <div className="icon">
        <IconButton className="icon">
          {videoState ? (
            <VideocamRoundedIcon
              onClick={videoToggle}
              className="controls__icon"
              fontSize="large"
            />
          ) : (
            <VideocamOffRoundedIcon
              onClick={videoToggle}
              className="controls__icon"
              fontSize="large"
            />
          )}
        </IconButton>
      </div>
      <div className="icon">
        <IconButton>
          <CallEndIcon className="controls__icon" fontSize="large" />
        </IconButton>
      </div>
      <div className="icon">
        <IconButton className="icon">
          <ForumIcon className="controls__icon" fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
}

export default Controls;
