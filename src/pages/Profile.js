import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return user ? <h1>{user.displayName}</h1> : <h1>Not Logged In</h1>;
};

export default Profile;
