// Even after logged in, if a force reload is done, profile page will not be displayed (error is displayed) because the UI is rendered before it gets data from the firebase. This problem is solved by creating a private route which prevents this and allows users to access profile page only if they are logged in, else re-directed to sign-in page on clicking profile page. This is achieved by creating a custom hook useAuthStatus along with private routing.

import { Navigate, Outlet } from 'react-router-dom';

// Importing the custom hook:
import { useAuthStatus } from '../hooks/useAuthStatus';

// Importing Spinner for loading:
import Spinner from './Spinner';

const PrivateRoute = () => {
  /* // Later, checked if it is logged in with the firebase. Now, a dummy variable to handle that:
  const loggedIn = false; */

  // Destruring values from useAuthStatus:
  const { loggedIn, checkingStatus } = useAuthStatus();

  // If checkingStatus is true, diplay a spinner:
  if (checkingStatus) {
    return <Spinner />;
  }

  // Whatever is returned below depends on the logged in condition. If logged in, Outlet will be returned which represents the children components, and if not, navigated to sign-in page:
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
