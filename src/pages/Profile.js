import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// To update user database in the firestore:
import { updateDoc, doc } from 'firebase/firestore';

// To update user profile in Auth:
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase.config';

// To toast alerts:
import { toast } from 'react-toastify';

// To create listing:
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import { Link } from 'react-router-dom';

// To show created listings:
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import ListingItem from '../components/ListingItem';

const Profile = () => {
  const auth = getAuth();

  // State to enable changing user details:
  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  // Destructuring name and email:
  const { name, email } = formData;

  // Initialize useNavigate:
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);

      let listings = []; // const can be used

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

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

  // On Delete
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure, you want to delete?')) {
      await deleteDoc(doc(db, 'lisitngs', listingId)); // can be done by creating ref too (docRef)

      // To show updated list after deleting one:
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success('Successfully deleted listing');
    }
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

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
