import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; // To receive the information from the backend.
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Main.css';
import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import itsamatch from '../assets/itsamatch.png';
import api from '../services/api';

// match from react-router-dom = Has all the parameters that was passed by this route.
// So to get the id of the user just use 'match.params.id'.
export default function Main({ match }) {
  Main.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
  };

  const [users, setUsers] = useState([]);
  // State which says if the user received a match or not.
  const [matchDev, setMatchDev] = useState(null);

  // Call the API when the component is displayed on screen.
  // useEffect has two parameters. 1 function that I want (arrow function), 2 WHEN I want execute this function.
  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: { user: match.params.id },
      });
      // Then we have to set these information, so we need the 'useState' here to set how many users we have found.
      setUsers(response.data);
    }
    loadUsers();
    // What that '[match.params.id]' means? Everytime when the ID in the browser is changed, it'll call the useEffect again.
  }, [match.params.id]);

  // This 'useEffect' connects to the websocket to get the 'match' in real time.
  useEffect(() => {
    const socket = io('http://localhost:3333', {
      // Sending the user's id to the backend with connection.
      query: { user: match.params.id },
    });

    // Receive the 'match' information from which dev.
    socket.on('match', dev => {
      // Get all the 'dev' information to use below in the condition 'matchDev &&'.
      setMatchDev(dev);
    });
    // Connects to the user's id. Everytime when someone connects this 'useEffect' runs again.
  }, [match.params.id]);

  // handleLike receive as a parameter the 'id' of the user that will receive the 'like'.
  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id },
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    // 3 parameters. First = route, Second = null (dont='t have body - Insmonia), Three = user.
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id },
    });

    // Editing the state.
    // Deleting the user that was 'liked' or 'disliked'. Will show only the users that haven't received any like or dislike.
    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      {/* Go back to the login */}
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      {users.length > 0 ? (
        <ul>
          {/* getting through the 'users (state)' array */}
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                {/* () => handleDislike(user._id) its a trick, must have a function to execute the function handleDislike */}
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">No more devs! :(</div>
      )}

      {/* If I have 'matchDev, show it below. */}
      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match!" />
          <img className="avatar" src={matchDev.avatar} alt="avatar" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          {/* onClick = set null in matchDev to close the window. */}
          <button type="button" onClick={() => setMatchDev(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
