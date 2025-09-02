import {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../firebase/config';

import api from './api';

class AuthService {
    // Sign in with Google
    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            // Add scopes if needed
            provider.addScope('profile');
            provider.addScope('email');

            // Force account selection even when already signed in
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            console.log('Starting Google sign-in process...');
            const result = await signInWithPopup(auth, provider);

            const token = await result.user.getIdToken();

            // Send token to backend
            const response = await api.post('/authentication/google', { token });
            console.log('Backend authentication successful');

            localStorage.setItem('authUser', JSON.stringify(response.data));

            return response.data;
        } catch (error) {
            console.error('Google authentication error:', error);
            // Handle specific error cases
            if (error.code === 'auth/invalid-credential') {
                // Clear any existing auth data that might be causing conflicts
                localStorage.removeItem('authUser');
                await firebaseSignOut(auth);
                throw new Error('Authentication failed. Please try again with valid credentials.');
            }

            throw error;
        }
    }

    // Sign in with Apple
    async signInWithApple() {
        try {
            const provider = new OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');

            const result = await signInWithPopup(auth, provider);

            // Get the ID token for server verification
            const token = await result.user.getIdToken();

            // Send the token to your NestJS backend
            const response = await api.post('/authentication/apple', { token });

            console.log('Apple authentication response:', response);

            // Store the server response
            localStorage.setItem('authUser', JSON.stringify(response.data));

            return response.data;
        } catch (error) {
            console.error('Apple authentication error:', error);

            if (error.code === 'auth/invalid-credential') {
                // Clear any existing auth data
                localStorage.removeItem('authUser');
                await firebaseSignOut(auth);
                throw new Error('Apple authentication failed. Please try again with valid credentials.');
            }

            throw error;
        }
    }

    // Sign out
    async signOut() {
        try {
            await firebaseSignOut(auth);
            localStorage.removeItem('authUser');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('authUser'));
    }

    // Get auth token for API requests
    getAuthToken() {
        const user = this.getCurrentUser();
        return user ? user.access_token : null;
    }
}

export default new AuthService();
