/**
 * IMPORTS
 */
import "../styles/TwitEditor.css";
import React, { useState, useCallback, useRef, useEffect } from "react";
import _ from "lodash";
import { getCurrentWordAt } from "../../utils/getCurrentWordAt";
import {
  MAX_CHARACTERS_ALLOWED,
  TYPEAHEAD_TRIGGER,
} from "../constants/constraints";
import {
  KEYCODE_MAPPER,
  MAX_SUGGESTIONS_ALLOWED,
  COMPOSEBOX_PLACEHOLDER,
} from "../../constants/constants";
import fetchTwitterUsers from "../../utils/fetchTwitterUsers";
import UserSuggestions from "../UserSuggestions";
import { extractUserData } from "../../utils/extractUserData";
import ErrorBoundary from "../ErrorBoundary";
/**
 * IMPORTS END
 */

function TwitEditor({ cacheObj }) {
  /**
   * STATE
   * */
  //for getting cursor position we need ref to Twit TextArea
  const twitArea = useRef();
  //cache comes from the Compose component passed as props
  const { cache, setCache } = cacheObj;
  const [charactersLeft, setCharactersLeft] = useState(MAX_CHARACTERS_ALLOWED);
  const [showUserSuggestions, setUserSuggestionsVisiblity] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0); //index

  const [twit, setTwit] = useState("");
  const [currentWordObj, setCurrentWordObj] = useState({
    currentWord: "",
    startPos: 0,
    endPos: 0,
  });
  //query depends on currentWordObj
  const [query, setQuery] = useState("");
  /**
   * STATE END
   */

  /**
   * SEARCH AND CACHE FUNCTIONS
   */
  function APISearchThenCache(q) {
    const query = q.toLowerCase();
    console.log("Fetching from Twitter API", query);
    try {
      const res = fetchTwitterUsers(query)
        .then((res) => {
          //process fetched data before adding to cache
          const cachedUsers =
            res && res.users && res.users.map((user) => extractUserData(user));
          cache[query] = cachedUsers;
          setCache(cache);
          setCurrentSuggestions(cachedUsers.slice(0, MAX_SUGGESTIONS_ALLOWED));
        })
        .catch(setCurrentSuggestions([]));
    } catch (err) {
      setCache({});
    }
  }

  /**
   * useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.
   * useCallback was added so debouncedSearch wouldn't be reinitialized on every rerender
   */
  const debouncedApiSearchAndCache = useCallback(
    _.debounce((query) => APISearchThenCache(query), 350),
    []
  );

  function searchCacheAndAPI() {
    if (cache.hasOwnProperty(query)) {
      console.log("Fetching from cache...");
      setCurrentSuggestions(cache[query].slice(0, MAX_SUGGESTIONS_ALLOWED));
    } else {
      console.log("Fetching from Twitter API", query);
      debouncedApiSearchAndCache(query);
    }
  }

  /**
   * EVENT LISTENERS
   */

  //textArea onChange

  useEffect(() => {
    setCurrentSuggestions([]);
    if (query.length > 2) {
      console.log("useeffect fired");
      setUserSuggestionsVisiblity(true);
      searchCacheAndAPI();
    } else {
      setUserSuggestionsVisiblity(false);
    }
    return () => {
      setUserSuggestionsVisiblity(false);
    };
  }, [query]);

  useEffect(() => {
    setCharactersLeft(MAX_CHARACTERS_ALLOWED - twit.length);
    const cursorPosition = twitArea.current.selectionEnd;
    setCurrentWordObj(getCurrentWordAt(cursorPosition, twit));
  }, [twit]);

  useEffect(() => {
    const { currentWord } = currentWordObj;
    if (currentWord.startsWith(TYPEAHEAD_TRIGGER) && currentWord.length > 2) {
      setUserSuggestionsVisiblity(true);
      const searchQuery = currentWord.slice(1).toLowerCase();
      setQuery(searchQuery);
      //search in cache first
      if (cache.hasOwnProperty(searchQuery)) {
        console.log("Fetching from Cache");
        setCurrentSuggestions(
          cache[searchQuery].slice(0, MAX_SUGGESTIONS_ALLOWED)
        );
      } else {
        console.log("searchQuery", searchQuery);
        //start debounced api search and add to cache it afterwards
        debouncedApiSearchAndCache(searchQuery);
      }
      //show suggested users
      setUserSuggestionsVisiblity(true);
    }
    return () => {
      setUserSuggestionsVisiblity(false);
    };
  }, [currentWordObj]);

  const _handleChange = (e) => {
    setUserSuggestionsVisiblity(false);
    const text = e.target.value;
    setTwit(text);
    // const words = text.split(" ");
    // const currentWord = words[words.length - 1];
    // const { currentWord } = currentWordObj;
  };

  /**
   * Arrow & Enter Keys navigation
   */
  const _handleKeyDown = (key) => {
    updateCursor();
    //navigation

    const { keyCode } = key;
    if (keyCode in KEYCODE_MAPPER) {
      //prevent default actions for arrows and enter keys
      console.log("keycode in keycodemapper");
      key.preventDefault();
      let selected = selectedSuggestion;
      const len = currentSuggestions && currentSuggestions.length;

      switch (KEYCODE_MAPPER[keyCode]) {
        case "forward": {
          selected = (selected + 1) % len;
          setSelectedSuggestion(selected);
          break;
        }
        case "backward": {
          //was difficult to come up with the algorithm
          if (selected < 0) selected = 0;
          selected = (len + (selected - 1)) % len;
          setSelectedSuggestion(selected);
          break;
        }
        case "enter": {
          addSuggestion();
          break;
        }
      }
    }

  };

  /**
   * if user clicks anywhere in the textarea, the currentWord will be updated,
   */

  function updateCursor() {
    const cursorPosition = twitArea.current.selectionEnd;
    const currentWordObj = getCurrentWordAt(cursorPosition, twit);
    setCurrentWordObj(currentWordObj);
  }

  const _handleClick = () => {
    updateCursor();
  };

  //add @mention
  //will also be passed as props to UserSuggestions -> UserItem
  function addSuggestion(suggestion) {
    if (currentSuggestions.length > 0 && selectedSuggestion !== -1) {
      const preMention = twit.slice(0, currentWordObj.startPos);
      const postMention = twit.slice(currentWordObj.endPos, twit.length);
      const mention =
        suggestion || currentSuggestions[selectedSuggestion].screen_name;
      setTwit(preMention + "@" + mention + postMention);
      setQuery("");
      twitArea.current.focus();
    }
  }

  /**
   * RENDERING COMPONENT
   */

  return (
    <div className="TwitEditor">
      <textarea
        ref={twitArea}
        value={twit}
        placeholder={COMPOSEBOX_PLACEHOLDER}
        onClick={_handleClick}
        onChange={(e) => _handleChange(e)}
        onKeyDown={(e) => _handleKeyDown(e)}
      />
      <div className="charactersLeft">
        {JSON.stringify(currentWordObj)}
        {query} {charactersLeft}
      </div>
      <ErrorBoundary>
        {showUserSuggestions && currentSuggestions.length > 0 && (
          <UserSuggestions
            results={currentSuggestions}
            selected={selectedSuggestion}
            addSuggestion={addSuggestion}
          />
        )}
      </ErrorBoundary>
    </div>
  );

  /**
   * RENDERING - END ---
   */
}

export default TwitEditor;
