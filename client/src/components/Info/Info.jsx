import React from "react";
import "./Info.css";

const agile_process = require("../../static/agile_process.png");

function Info() {
  return (
    <div className="info">
      <div className="info__item">
        <div clasName="text_container">Hello world</div>
        <img
          alt="image not found"
          className="image"
          md={5}
          src={String(agile_process)}
        />
      </div>
    </div>
  );
}

export default Info;
