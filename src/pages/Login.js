import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logo from '../assets/logo.svg';
import './Login.css';
import api from '../services/api';

export default function Login({ history }) {
  Login.propTypes = {
    history: PropTypes.any,
  };

  const [username, setUsername] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      username,
    });

    const { _id } = response.data;

    history.push(`/dev/${_id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />
        <input placeholder="Type your GitHub user" value={username} onChange={e => setUsername(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
