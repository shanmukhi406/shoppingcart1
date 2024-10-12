import React, { useState } from 'react';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        // Basic validation for email and password
        if (email === '' || password === '' || confirmPassword === '') {
            setError('Email and both passwords are required.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Here, you would typically send the credentials to your API
        console.log('Creating account with:', { email, password });

        // Clear the fields after login attempt
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="login-container">
            <h2>Create Account</h2>
            <form onSubmit={handleLogin}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6} // Require at least 6 characters
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Re-enter Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="create-account-button">Create Account</button>
            </form>
        </div>
    );
};

export default LoginComponent;
