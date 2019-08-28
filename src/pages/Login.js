import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logo from '../assets/logo.svg';
import './Login.css';
import api from '../services/api';

export default function Login({ history }) {
  Login.propTypes = {
    history: PropTypes.any,
  };

  // State.
  // When I need to edit the user name I call "setUsername", when I need the user name, I call "username"
  const [username, setUsername] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // calling the api (axios), so use "async/await" to get all the information about the user.
    const response = await api.post('/devs', {
      username,
    });

    // What do I want? Only the id of the user, so...
    // _id is inside of 'response.data'
    const { _id } = response.data;

    history.push(`/dev/${_id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />
        {/* onChange = Event will set on 'setUsername' the value of the target which is the input. */}
        <input placeholder="Type your GitHub user" value={username} onChange={e => setUsername(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
