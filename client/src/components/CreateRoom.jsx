import React, { useContext, useState, useRef, useEffect } from "react";
import { v1 as uuid } from "uuid";
import { Button, TextField, Grid } from "@material-ui/core";
import "./CreateRoom.css";
import UserVideo from "./UserVideo";
import Header from "./Header";
import { Link } from "react-router-dom";
import { SocketContext } from "../SocketContext.js";

function CreateRoom() {
  const { videoState, audioState, roomID, setRoomID, name, setName } =
    useContext(SocketContext);

  return (
    <div className="">
      <Header />
      <Grid container className="createRoomContainer">
        <Grid item md={6} className="gridItem">
          <div className="userVideoContainer">
            <div className="wrapper">
              <UserVideo showButtons={true} />
            </div>
          </div>
        </Grid>
        <Grid item md={6} className="gridItem">
          <div className="optionsContainer">
            <div className="options">
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
              <div className="buttonContainer">
                <Link
                  to={{
                    pathname: `/room/${roomID}`,
                    state: { userName: name },
                    videoState,
                    audioState,
                  }}
                >
                  <Button variant="contained" color="primary">
                    Join
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateRoom;
