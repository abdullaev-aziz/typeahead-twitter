import React, { useState } from "react";

const URL = "https://api.twitter.com/1.1/users/search.json"
const bearerToken =
    "AAAAAAAAAAAAAAAAAAAAALLqLQEAAAAAWBqgXykr8E%2FVCAZ7ZsBzPp%2B%2Bc7M%3D3ykCHSkGmf6OheUQT4OPnBsruXS4TCDocIKopZl6aG2PbB5pyU";
const query = 'q=soccer'

const title = "React";

function TwitterFetch() {
    const [counter, setCounter] = useState(0);

    const handleClick = () => {
        const fullQuery = `${URL}?${query}`
        fetch(fullQuery, {
            headers: {
                "authorization": `Bearer ${bearerToken}`
            }
        }).then(res => res.json())
            .then(data => console.log(data))
    };

    return <div className="App">
        <h1>Twitter API Component</h1>
        <button onClick={handleClick}>Fetch Twitter API</button>

    </div>;
}

export default TwitterFetch;