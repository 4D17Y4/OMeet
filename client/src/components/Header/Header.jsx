import React from "react";
import "./Header.css";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import HomeIcon from "@material-ui/icons/Home";
import "../../font/font.css";

function Header() {
  function toggleInfo() {
    console.log("info clicked");
  }

  function toggleHome() {
    console.log("Home clicked");
  }

  return (
    <div className="header">
      <IconButton>
        <HomeIcon
          fontSize="large"
          className="header__icon"
          onClick={toggleHome}
        />
      </IconButton>
      <div className="header__name">
        <p align="center">OMeet</p>
      </div>
      <IconButton>
        <InfoIcon
          fontSize="large"
          className="header__icon"
          onClick={toggleInfo}
        />
      </IconButton>
    </div>
  );
}

export default Header;
