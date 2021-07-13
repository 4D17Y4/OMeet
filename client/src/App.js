import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/CreateRoom/CreateRoom";
import Home from "./components/Home/Home";
import VideoRoom from "./components/VideoRoom/VideoRoom";
import "./App.css";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import { initializeIcons } from "@fluentui/react";

initializeIcons();

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/chat/:roomID" component={ChatRoom} />
        <Route path="/preview" exact component={CreateRoom} />
        <Route path="/room/:roomID" component={VideoRoom} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
