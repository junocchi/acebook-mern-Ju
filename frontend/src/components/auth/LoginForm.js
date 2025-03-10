import React, { useState } from 'react';
const LogInForm = ({ navigate, token }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    let response = await fetch(`${process.env.REACT_APP_API_URL}/tokens`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.status !== 201) {
      navigate('/login');
    } else {
      let data = await response.json();
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('user_id', data.user_id);

      token(data.token);

      navigate('/posts');
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder='Email'
        id='email'
        type='text'
        value={email}
        onChange={handleEmailChange}
      />
      <input
        placeholder='Password'
        id='password'
        type='password'
        value={password}
        onChange={handlePasswordChange}
      />
      <input role='submit-button' id='submit' type='submit' value='Submit' />
    </form>
  );
};

export default LogInForm;
