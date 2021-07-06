import React, { useEffect, useRef, useState } from "react";
import "./ParticipantVideo.css";
import MicOffRoundedIcon from "@material-ui/icons/MicOffRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
/**
 * Video
 * Sets up the video of the particiapant.
 * @param {string name: Name of the participant,
 *         boolean videoState: current video state of the participant,
 *         boolean audioState: current audio state of the paricipant} props
 * @returns
 */
function ParticipantVideo(props) {
  const ref = useRef();
  const [connecting, setConnecting] = useState(true);
  const [videoState, setVideoState] = useState(props.videoState);
  const [audioState, setAudioState] = useState(props.audioState);
  const [name, setNameState] = useState(props.name);
  const [width, setWidthState] = useState();
  const [height, setHeightState] = useState();
  const [className, setClassName] = useState("videoOff");
  /**
   * Use Effect for participants Video.
   */
  useEffect(() => {
    // setNameState(props.name);
    /**
     * On recieveing the participants stream, set the ref and set connecting to false.
     *
     * */
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
      setConnecting(false);
      if (videoState) {
        setClassName("videoOn");
      } else {
        setClassName("videoOff");
      }
    });

    props.peer.on("name", (name) => {
      setNameState(name);
    });

    /**
     * Update the user stream status.
     */
    props.peer.on("update", (payload) => {
      setVideoState(payload.videoEnabled);
      setAudioState(payload.audioEnabled);
      if (payload.videoEnabled) {
        setClassName("videoOn");
      } else {
        setClassName("videoOff");
      }
    });
  }, []);

  return (
    <div className={"videoContainer " + className}>
      <video playsInline autoPlay ref={ref} className="participantVideo" />
      <div className="videoContainer__info">
        <div className="videoContainer__information">
          <h2>{name}</h2>
          {connecting ? (
            <div className="connecting" />
          ) : audioState ? (
            <div className="on">
              <MicRoundedIcon />
            </div>
          ) : (
            <div className="off">
              <MicOffRoundedIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantVideo;
