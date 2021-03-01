import React from "react";
import UserItem from "./UserItem";

function UserSuggestions({ results, selected, addMention }) {
    return (
      <div className="user-suggestions">
        {results.map((user, key) => {
          const suggestionClassName =
            key === selected ? "user-item selected" : "user-item";
          return (
            <UserItem
              user={user}
              className={suggestionClassName}
              key={`user-suggestion-${key}`}
              addMention={addMention}
            />
          );
        })}
      </div>
    );
}

export default UserSuggestions;
