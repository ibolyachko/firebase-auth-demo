import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const { currentUser, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user profile data from your backend
        const fetchUserData = async () => {
            try {
                const response = await api.get('/authentication/profile');
                setUserData(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setError("Failed to load user data");
            }
        };

        fetchUserData();
    }, []);

    async function handleLogout() {
        setError('');

        try {
            await signOut();
            navigate('/login');
        } catch {
            setError('Failed to log out');
        }
    }

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="profile">
                <h3>Profile</h3>
                {userData ? (
                    <div>
                        <p>Email: {userData.email}</p>
                        <p>Name: {userData.name}</p>
                        {/* Display other user data */}
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}
