import React from "react";
import "../styles/UserItem.css";

function UserItem({ user, className, addMention }) {
  const { name, screen_name, profile_image_url, verified } = user;
  return (
    <div className={className} onClick={() => addMention(screen_name)}>
      <img src={profile_image_url} alt="profile_image" />
      <span className="screen-name">@{screen_name}</span>
      <span className="name">{name}</span>
      <div className="verified">{verified && "VERIFIED"}</div>
    </div>
  );
}

export default UserItem;
