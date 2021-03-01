import React, { useState } from "react";
import "../styles/Compose.css";
import ProfileHeader from "./ProfileHeader";
import { LOGGED_IN_USER } from "../constants/constants";
import { extractUserData } from "../utils/extractUserData";
import TwitEditor from "./TwitEditor";

const defaultUser = extractUserData(LOGGED_IN_USER);

function Compose() {
  //queries cache
  const [cache, setCache] = useState({});

  return (
    <div className="compose">
      <ProfileHeader user={defaultUser} />
      <TwitEditor cacheObj={{ cache, setCache }} />
    </div>
  );
}

export default Compose;
