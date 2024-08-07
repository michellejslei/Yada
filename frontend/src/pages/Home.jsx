import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/upload');
  };

  const handleLogin = async () => {
    if (user) {
      try {
        const token = await getAccessTokenSilently();
        const userInfo = {
          sub: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
          updated_at: user.updated_at
        };
        await fetch('http://localhost:3000/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ user: userInfo })
        });
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      handleLogin();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="main">
      <div className="homepage">
        <h1 className="heading">Welcome to YADA</h1>
        <div className="input-box">
          <p className="subtitle">
            Upload your course notes or paste them below to create a personalized study guide!
          </p>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Log In</button>
          ) : (
            <>
              <p>Welcome, {user.name}</p>
              <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
              <button onClick={handleNavigate}>Go to Upload</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
