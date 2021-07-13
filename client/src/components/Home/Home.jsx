import React, { useContext } from "react";
import "./Home.css";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import { SocketContext } from "../../SocketContext.js";
import { v4 as uuidv4 } from "uuid";

const logo = require("../../static/microsoft_teams.png");

function Home() {
  const { name, roomID, setRoomID, setName } = useContext(SocketContext);

  return (
    <div>
      {/* Header */}
      <Header props={null} home={true} />

      {/* Join room */}
      <div className="joinRoom">
        <div className="joinRoom__form width100 height100">
          <div className="joinRoom__image">
            <img alt="error not found" height="100%" src={String(logo)} />
          </div>

          {/* Input form */}
          <div className="joinRoomform__wrapper">
            <input
              className="input__field"
              label="Name"
              placeholder="What should we call you"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input__field"
              label="Room ID"
              placeholder="Room id"
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
            />
            <div className="joinRoomform__submit width100 height100">
              <button
                onClick={() => {
                  setRoomID(uuidv4());
                }}
                className="joinRoom__button"
              >
                Generate
              </button>
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

      {/* Empty footer */}
      <div className="bottom__empty" />
    </div>
  );
}

export default Home;
