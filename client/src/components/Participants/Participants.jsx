import React from "react";
import "./Participants.css";
import "./Participants.css";

function Participants({ room, users }) {
  return (
    <div className="participants__container height100">
      {/* Participant Head */}
      <div className="participants__head">{room}</div>

      {/* Participants List */}
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
