// import React from "react";
import "./Header.css";
import * as React from "react";
import IconButton from "@material-ui/core/IconButton";

import { Icon } from "@fluentui/react/lib/Icon";

function Header() {
  function toggleInfo() {
    console.log("info clicked");
  }

  function toggleHome() {
    console.log("Home clicked");
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
