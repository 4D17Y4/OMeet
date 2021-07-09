import React, { useContext, useEffect } from "react";
import "./Home.css";
import Header from "../Header/Header";
// import "../CreateRoom/CreateRoom.css";
import { Button, TextField, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { SocketContext } from "../../SocketContext.js";
import { v4 as uuidv4 } from "uuid";
const logo = require("../../static/microsoft_teams.png");

function Home() {
  const { name, roomID, setRoomID, setName } = useContext(SocketContext);

  return (
    <div>
      <Header />
      <div className="joinRoom">
        <div className="joinRoom__form">
          <div className="joinRoom__image">
            <img src={String(logo)} />
          </div>
          <div className="joinRoomform__wrapper">
            <input
              className="input__field"
              label="Name"
              placeholder="What should we call you"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <input
              className="input__field"
              style={{ marginTop: "10px" }}
              label="Room ID"
              placeholder="Room id"
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              fullWidth
            />
            <div className="joinRoomform__submit">
              <Link
                onClick={() => {
                  setRoomID(uuidv4());
                }}
              >
                <button className="joinRoom__button">Generate</button>
              </Link>
              <Link
                onClick={(event) =>
                  !name || !roomID ? event.preventDefault() : null
                }
                to={{
                  pathname: `/chat/${roomID}`,
                  state: { userName: name },
                }}
              >
                <button className="joinRoom__button">Join</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom__empty" />
    </div>
  );
}

export default Home;
