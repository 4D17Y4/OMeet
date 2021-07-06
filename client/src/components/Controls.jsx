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
    <div className="control">
      <div className="control__icon">
        <IconButton>
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
      <div className="control__icon">
        <IconButton>
          {videoState ? (
            <VideocamRoundedIcon
              onClick={videoToggle}
              className="control__button"
              fontSize="large"
            />
          ) : (
            <VideocamOffRoundedIcon
              onClick={videoToggle}
              className="control__button"
              fontSize="large"
            />
          )}
        </IconButton>
      </div>
      <div className="control__icon">
        <IconButton>
          <CallEndIcon className="control__button" fontSize="large" />
        </IconButton>
      </div>
      <div className="control__icon">
        <IconButton>
          <ForumIcon className="control__button" fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
}

export default Controls;
