import React from "react";
import "./Participants.css";
import "./Participants.css";

function Participants({ room, users }) {
  console.log(users);
  return (
    <div className="participants">
      <div className="roomName">{room}</div>
      {users.map((user, i) => {
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "15px",
              fontSize: "1.3em",
            }}
          >
            {user.name}
          </div>
        );
      })}
    </div>
  );
}

export default Participants;
