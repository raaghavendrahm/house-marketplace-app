import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// To update user database in the firestore:
import { updateDoc, doc } from 'firebase/firestore';

// To update user profile in Auth:
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase.config';

// To toast alerts:
import { toast } from 'react-toastify';

const Profile = () => {
  const auth = getAuth();

  // State to enable changing user details:
  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // Destructuring name and email:
  const { name, email } = formData;

  // Initialize useNavigate:
  const navigate = useNavigate();

  // On Logout:
  const onLogout = () => {
    // Logging out from firebase:
    auth.signOut();

    // Redirect:
    navigate('/');
  };

  // On Submit
  const onSubmit = async () => {
    try {
      // Check if the current user display name is not same as actual name:
      if (auth.currentUser.displayName !== name) {
        // Update display name is firebase:
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore:
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name, // ES6 for name: name
        });
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  // On Change:
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />

            <input
              type="text"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
