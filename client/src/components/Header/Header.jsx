import React, { useContext } from "react";
import "./Header.css";
import IconButton from "@material-ui/core/IconButton";
import { Icon } from "@fluentui/react/lib/Icon";
import { SocketContext } from "../../SocketContext.js";

function Header({ props, home }) {
  const { endCall } = useContext(SocketContext);

  function toggleInfo() {
    window.open("https://github.com/4D17Y4/OMeet");
  }

  function toggleHome() {
    console.log("Home clicked");
    if (!home) {
      if (
        window.confirm(
          "Are you sure ? You will leave the room, you can join as a new member."
        )
      ) {
        // end call on unload and redirect to home page.
        endCall();
        props.history.push("/");
      }
    }
  }

  return (
    <div className="header backgroundP colorT3">
      <IconButton onClick={toggleHome}>
        <Icon iconName="HomeSolid" fontSize="large" className="header__icon" />
      </IconButton>
      <div className="header__name">
        <p align="center">OMeet</p>
      </div>
      <IconButton onClick={toggleInfo}>
        <Icon iconName="InfoSolid" fontSize="large" className="header__icon" />
      </IconButton>
    </div>
  );
}

export default Header;
