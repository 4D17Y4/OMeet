import React, { useContext, useState, useRef, useEffect } from "react";
import Cookies from "universal-cookie";
import "./UserVideo.css";
import MicOffRoundedIcon from "@material-ui/icons/MicOffRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import VideocamOffRoundedIcon from "@material-ui/icons/VideocamOffRounded";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import IconButton from "@material-ui/core/IconButton";
import { SocketContext } from "../../SocketContext.js";

function UserVideo(props) {
  const { userPreview, videoState, audioState, audioToggle, videoToggle } =
    useContext(SocketContext);

  useEffect(() => {
    console.log(props);
    console.log(props.showButtons);
  }, []);

  return (
    <div className="userFloating">
      <div className="videoFrame">
        <video className="videoFrame__video" ref={userPreview} autoPlay />
        {props.showButtons ? (
          <div className="videoFrame__buttonContainer">
            <IconButton>
              {audioState ? (
                <MicRoundedIcon
                  onClick={audioToggle}
                  className="videoFrame__muteMicrophone"
                  style={{ fontSize: 40 }}
                />
              ) : (
                <MicOffRoundedIcon
                  onClick={audioToggle}
                  className="videoFrame__onMicrophone"
                  style={{ fontSize: 40 }}
                />
              )}
            </IconButton>
            <IconButton>
              {videoState ? (
                <VideocamRoundedIcon
                  onClick={videoToggle}
                  className="videoFrame__muteCamera"
                  style={{ fontSize: 40 }}
                />
              ) : (
                <VideocamOffRoundedIcon
                  onClick={videoToggle}
                  className="videoFrame__onCamera"
                  style={{ fontSize: 40 }}
                />
              )}
            </IconButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UserVideo;
