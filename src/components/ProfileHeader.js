import React from "react";
import "../styles/ProfileHeader.css";

function ProfileHeader({ user }) {
  const { name, screen_name, profile_image_url } = user;
  return (
    <div className="profile-header">
      <img alt="profile-image" src={profile_image_url} />
      <span className="name">{name}</span>
      <span>@{screen_name}</span>
    </div>
  );
}

export default ProfileHeader;
