import React from 'react';

const SignIn = () => {
  return (
    <div className="container mt-5">
      <h2>Sign In</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="Enter your email" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Enter your password" />
        </div>
        <button type="submit" className="btn btn-primary">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
