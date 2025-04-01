import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        profilePicture: 'https://via.placeholder.com/100',
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <div className="d-flex align-items-center mb-4">
                            <img src={user.profilePicture} alt="Profile" className="rounded-circle me-3" style={{ width: '100px', height: '100px' }} />
                            <div>
                                <h4 className="fw-bold">{user.name}</h4>
                                <p className="text-muted">{user.email}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <Link to="/edit-profile" className="btn btn-primary">Edit Profile</Link>
                            <button className="btn btn-danger">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
