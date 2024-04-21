import React from "react";
import axios from "axios";
import { useState } from "react";

function Playlist(props) {
  const API = `http://127.0.0.1:5000/utube/video/${props.id}`;

  return <>This is a playlist page.</>;
}

export default Playlist;
