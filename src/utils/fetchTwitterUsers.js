import { API_URL } from "../constants/api_routes";

async function fetchTwitterUsers(query) {
    const response = await fetch(`${API_URL}?username=${query}`);
    if(!response.ok) {
      console.log('Error fetching Twitter')
      return [];
    }
    const users = await response.json();
    console.log(users.users)
    return users.users;
  }


export default fetchTwitterUsers;
