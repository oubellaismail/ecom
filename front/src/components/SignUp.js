import React from 'react';

const SignUp = () => {
  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" placeholder="Enter your name" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="Enter your email" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Enter your password" />
        </div>
        <button type="submit" className="btn btn-success">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
