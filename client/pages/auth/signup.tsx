import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use_request';

const onSubmit = async event => {
  event.preventDefault();
  await doRequest();
};

export default () => {
  let [ email, setEmail ] = useState('');
  let [ password, setPassword ] = useState('');
  
  let { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });
  

  return (
    <form onSubmit={ onSubmit }>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={ email }
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={ password }
          onChange={e => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      { errors }
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
