import _ from "lodash";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  MAX_TWIT_LENGTH_ALLOWED,
  MAX_SUGGESTIONS_ALLOWED,
  COMPOSEBOX_PLACEHOLDER,
  TYPEAHEAD_TRIGGER,
  DEBOUNCE_DELAY,
  QUERY_THRESHOLD,
  KEYCODE_MAPPER,
} from "../constants/constants";
import { getCurrentWordAt } from "../utils/getCurrentWordAt";
import fetchTwitterUsers from "../utils/fetchTwitterUsers";
import { extractUserData } from "../utils/extractUserData";
import UserSuggestions from "./UserSuggestions";
import ErrorBoundary from "./ErrorBoundary";
import "../styles/TwitEditor.css";


function RefactoredEditor({ cacheObj }) {
  const twitArea = useRef();
  const { cache, setCache } = cacheObj;
  const [twit, setTwit] = useState("");
  const [charactersLeft, setCharactersLeft] = useState(MAX_TWIT_LENGTH_ALLOWED);
  const [currentWordObj, setCurrentWordObj] = useState({});
  const [currentCursorPosition, setCurrentCursorPosition] = useState(0);
  const [queryObj, setQueryObject] = useState({});
  const [suggestedMentions, setSuggestedMentions] = useState([]);
  //store index of mention
  const [selectedMention, setSelectedMention] = useState(0);

  function updateCursorPosition(newPos) {
    setCurrentCursorPosition(newPos);
  }
  /**
   * event listeners
   */

  //update twit in textarea
  const handleChange = (e) => {
    const text = e.target.value;
    setTwit(text);
    updateCursorPosition(e.target.selectionEnd);
  };

  //update current word on mouse click in textarea
  const handleClick = (e) => {
    updateCursorPosition(e.target.selectionEnd);
  };


  //handle arrow keys navigation
  const handleKeyDown = (e) => {
    const { keyCode } = e;
    //if keyCode is valid{left, right, up, down, enter keys} then trigger the specific action
    if (keyCode in KEYCODE_MAPPER) {
      const KEY = KEYCODE_MAPPER[keyCode];
      if (KEY === "left") {
        //go one symbol to the left and updates the cursor position
        const newPos =
          currentCursorPosition === 0 ? 0 : currentCursorPosition - 1;
        updateCursorPosition(newPos);
      } else if (KEY === "right") {
        const newPos =
          currentCursorPosition === twit.length
            ? twit.length
            : currentCursorPosition + 1;
        updateCursorPosition(newPos);
      } else {
        //prevent default behaviour for enter, up & down keys
        e.preventDefault();
        //up & down arrow navigation
        let selected = selectedMention || 0;
        const len = suggestedMentions.length;
        if (KEY === "up") {
          if (selected < 0) selected = 0;
          selected = (len + (selected - 1)) % len;
          setSelectedMention(selected);
        } else if (KEY === "down") {
          selected = (selected + 1) % len;
          setSelectedMention(selected);
        } else {
          //key enter
          addMention();
        }
      }
    }
  };

  //add @mention
  //will also be passed as props to UserSuggestions -> UserItem
  function addMention(suggestedMention) {
    const preMention = twit.slice(0, queryObj.startPos);
    const postMention = twit.slice(queryObj.endPos, twit.length);
    const mention =
      suggestedMention ||
      (suggestedMentions.length > 0
        ? suggestedMentions[selectedMention].screen_name
        : currentWordObj.currentWord);
    const newTwit = preMention + TYPEAHEAD_TRIGGER + mention + postMention;
    setTwit(newTwit);
    twitArea.current.focus();
  }

  useEffect(() => {
    setCharactersLeft(MAX_TWIT_LENGTH_ALLOWED - twit.length);
  }, [twit]);

  useEffect(() => {
    setCurrentWordObj(getCurrentWordAt(currentCursorPosition, twit));
  }, [currentCursorPosition]);

  //update query
  useEffect(() => {
    const wordObj = currentWordObj;
    let { currentWord } = wordObj;
    if (
      currentWord &&
      currentWord.startsWith(TYPEAHEAD_TRIGGER) &&
      currentWord.length > 2
    ) {
      currentWord = currentWord.toLowerCase();
      //leave alphanumeric, _, - symbols
      currentWord = currentWord.replace(/[^0-9a-z-_]/gi, "");
      wordObj.currentWord = currentWord;
      setQueryObject(wordObj);
    }
    return () => setQueryObject({});
  }, [currentWordObj]);

  /**
   * useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.
   * useCallback was added so debouncedSearch wouldn't be reinitialized on every rerender
   */
  const debouncedApiSearchAndCache = useCallback(
    _.debounce((query) => searchAPI(query), DEBOUNCE_DELAY),
    []
  );

  function searchAPI(query) {
    fetchTwitterUsers(query)
      .then((users) => {
        return users
          .slice(0, MAX_SUGGESTIONS_ALLOWED)
          .map((user) => extractUserData(user));
      })
      .then((firstTenUsers) => {
        const extractedUsers = firstTenUsers.map((user) =>
          extractUserData(user)
        );
        return extractedUsers;
      })
      .then((convertedUsers) => {
        setSuggestedMentions(convertedUsers);
        cache[query] = convertedUsers;
        setCache(cache);
        setSuggestedMentions(cache[query]);
      });
  }

  useEffect(() => {
    //search cache
    const query = queryObj.currentWord;
    if (!query || query.length < QUERY_THRESHOLD) {
      return setSuggestedMentions([]);
    }
    if (cache.hasOwnProperty(query)) {
      console.log("Fetching from cache...");
      setSuggestedMentions(cache[query]);
    } else {
      console.log("Fetching from Twitter API...");
      debouncedApiSearchAndCache(query);
    }
  }, [queryObj]);

  useEffect(() => {
    setSelectedMention(0);
  }, [suggestedMentions]);

  return (
    <div className="twit-editor">
      <textarea
        ref={twitArea}
        value={twit}
        placeholder={COMPOSEBOX_PLACEHOLDER}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        onClick={(e) => handleClick(e)}
      />
      <div className="characters-left">{charactersLeft}</div>
      <ErrorBoundary>
        <>
          {queryObj.currentWord && suggestedMentions && (
            <UserSuggestions
              results={suggestedMentions}
              selected={selectedMention}
              addMention={addMention}
            />
          )}
        </>
      </ErrorBoundary>
    </div>
  );
}

export default RefactoredEditor;
