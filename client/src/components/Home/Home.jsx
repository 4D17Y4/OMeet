import React, { useContext, useEffect } from "react";
import "./Home.css";
import Header from "../Header/Header";
// import "../CreateRoom/CreateRoom.css";
import { Button, TextField, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { SocketContext } from "../../SocketContext.js";

function Home() {
  const { name, roomID, setRoomID, setName } = useContext(SocketContext);

  return (
    <div>
      <Header />
      <div className="createRoom__form">
        <div className="form__wrapper">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            style={{ marginTop: "10px" }}
            label="Room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            fullWidth
          />
          <div className="form__submit">
            <Link
              onClick={(event) =>
                !name || !roomID ? event.preventDefault() : null
              }
              to={{
                pathname: `/chat/${roomID}`,
                state: { userName: name },
              }}
            >
              <Button variant="contained" color="primary">
                Join
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
