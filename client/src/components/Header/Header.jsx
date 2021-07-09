// import React from "react";
import "./Header.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { initializeIcons } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import "../../font/font.css";

initializeIcons();

function Header() {
  function toggleInfo() {
    console.log("info clicked");
  }

  function toggleHome() {
    console.log("Home clicked");
  }

  return (
    <div className="header backgroundP colorT3">
      <IconButton>
        <Icon
          iconName="HomeSolid"
          fontSize="large"
          className="header__icon"
          onClick={toggleHome}
        />
      </IconButton>
      <div className="header__name">
        <p align="center">OMeet</p>
      </div>
      <IconButton>
        <Icon
          iconName="InfoSolid"
          fontSize="large"
          className="header__icon"
          onClick={toggleInfo}
        />
      </IconButton>
    </div>
  );
}

export default Header;
