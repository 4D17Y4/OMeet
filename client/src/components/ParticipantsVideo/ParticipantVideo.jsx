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
function ParticipantVideo(props, key) {
  const ref = useRef();
  const [connecting, setConnecting] = useState(true);
  const [videoState, setVideoState] = useState(props.videoState);
  const [audioState, setAudioState] = useState(props.audioState);
  const [name, setNameState] = useState(props.name);
  const [className, setClassName] = useState("videoOff");

  /**
   * Use Effect for participants Video.
   */
  useEffect(() => {
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
  }, [props.peer, videoState]);

  return (
    <div className={"height100 width100 videoContainer " + className}>
      <video playsInline autoPlay ref={ref} className="width100 height100" />
      <div className="videoContainer__user">
        <div className="videoContainer__info">
          <h2>{name}</h2>
          {/* change accent color depending on the current status of the participant. */}
          {connecting ? (
            <div className="videoContainer__info--connecting" />
          ) : audioState ? (
            <div className="videoContainer__info--on">
              <MicRoundedIcon />
            </div>
          ) : (
            <div className="videoContainer__info--off">
              <MicOffRoundedIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantVideo;
