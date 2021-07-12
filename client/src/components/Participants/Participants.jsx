import React from "react";
import "./Participants.css";
import "./Participants.css";

function Participants({ room, users }) {
  return (
    <div className="participants__container height100">
      <div className="participants__head">{room}</div>
      {users.map((user, i) => {
        return (
          <div key={i} className="participants__name">
            {user.name}
          </div>
        );
      })}
    </div>
  );
}

export default Participants;
