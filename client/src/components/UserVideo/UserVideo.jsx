import React, { useContext } from "react";
import "./UserVideo.css";
import MicOffRoundedIcon from "@material-ui/icons/MicOffRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import VideocamOffRoundedIcon from "@material-ui/icons/VideocamOffRounded";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import { SocketContext } from "../../SocketContext.js";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const TeamsSwitch = withStyles({
  switchBase: {
    color: "var(--T2)",
    "&$checked": {
      color: "var(--P)",
    },
    "&$checked + $track": {
      backgroundColor: "var(--P)",
    },
  },
  checked: {},
  track: {},
})(Switch);

function UserVideo(props) {
  const {
    roomID,
    userPreview,
    videoState,
    audioState,
    audioToggle,
    videoToggle,
  } = useContext(SocketContext);

  return (
    <div className="videoFrame width100">
      {/* User preview */}
      <video
        muted
        className="videoFrame__video width100 height100"
        ref={userPreview}
        autoPlay
      />
      {props.showButtons ? (
        // check if we have to show buttons.
        <div className="videoFrame__buttonContainer width100">
          <div className="button__container">
            {/* Audio toggle */}
            <div className="toggle__container">
              {audioState ? (
                <MicRoundedIcon onClick={audioToggle} />
              ) : (
                <MicOffRoundedIcon onClick={audioToggle} />
              )}
              <TeamsSwitch
                checked={audioState}
                onChange={audioToggle}
                name="checkedC"
              />
            </div>
            {/* Video toggle */}
            <div className="toggle__container">
              {videoState ? (
                <VideocamRoundedIcon onClick={videoToggle} />
              ) : (
                <VideocamOffRoundedIcon onClick={videoToggle} />
              )}
              <TeamsSwitch
                checked={videoState}
                onChange={videoToggle}
                name="checkedC"
              />
            </div>
          </div>
          {/* Join button */}
          <Link
            style={{ height: "40px" }}
            to={{
              pathname: `/room/${roomID}`,
            }}
          >
            <button
              className="enterRoom__button joinRoom__button"
              style={{ width: "150px", margin: "0" }}
            >
              Join
            </button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default UserVideo;
