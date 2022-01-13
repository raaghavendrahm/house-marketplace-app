import { useEffect, useState } from 'react';

// "onAuthStateChanged" fires if state is changed between logged in and not logged in
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// To avoid memory leak warning that comes once a user is not logged in and redirected to sign in page on clicking Profile page, useRef hook is used:
import { useRef } from 'react';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true); // this is similar to 'loading' state

  // To prevent meomry leak:
  const isMounted = useRef(true);

  useEffect(() => {
    // To prevent memory leak it is put inside if condition for isMounted:
    if (isMounted) {
      // Creating auth
      const auth = getAuth();

      // onAuthStateChanged takes in auth and a funtion and gives back the user. So, if a user is fetched, setLoggedIn will be set to true and setCheckingStatus (loading) will be set to false. Then, loggedIn and checkingStatus values are returned from useAuthStatus hook for further use in PrivateRoute:

      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      });
    }

    // To prevent memory leak:
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkingStatus };
};

// Creating the custom hook to create private routes in V6 and preventing memory leak is done with the help of 2 stackoverflow articles. Links are in lesson 91,
