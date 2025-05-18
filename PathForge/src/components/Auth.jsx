import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig'; // Adjust path as needed
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import './Auth.css';

function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // User will be set by onAuthStateChanged
    } catch (error) {
      console.error("Error during Google login:", error);
      // TODO: Display error to user
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // User will be set to null by onAuthStateChanged
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-info">
          <img src={user.photoURL || './default-avatar.png'} alt={user.displayName || 'User'} className="user-avatar" />
          <span className="user-name">{user.displayName || user.email}</span>
          <button onClick={handleLogout} className="auth-button logout-button">Logout</button>
        </div>
      ) : (
        <button onClick={handleGoogleLogin} className="auth-button login-button">
          Login with Google
        </button>
      )}
    </div>
  );
}

export default Auth; 