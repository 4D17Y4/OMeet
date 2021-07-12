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

const PurpleSwitch = withStyles({
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
    <div className="videoFrame width100 height100">
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
            <div className="toggle__container">
              {audioState ? (
                <MicRoundedIcon onClick={audioToggle} />
              ) : (
                <MicOffRoundedIcon onClick={audioToggle} />
              )}
              <PurpleSwitch
                checked={audioState}
                onChange={audioToggle}
                name="checkedC"
              />
            </div>
            <div className="toggle__container">
              {/* </IconButton> */}
              {videoState ? (
                <VideocamRoundedIcon onClick={videoToggle} />
              ) : (
                <VideocamOffRoundedIcon onClick={videoToggle} />
              )}
              <PurpleSwitch
                checked={videoState}
                onChange={videoToggle}
                name="checkedC"
              />
            </div>
          </div>
          <Link
            style={{ height: "40px" }}
            to={{
              pathname: `/room/${roomID}`,
            }}
          >
            <button className="joinRoom__button enterRoom__button">Join</button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default UserVideo;
