import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const CreateListing = () => {
  // Geocoding API is used to get latitute and longitude values w.r.t the address entered. To do this, credit card details must be added to firebase. If not want to use, "geolocationEnabled" state can be set to false (which is true by default to enable geocoding), so that the form displays a section to add latitude and longitude values manually:
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  // Initializations:
  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true); // To prevent memory leak issue

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };

    // eslint-diable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (loading) {
    return <Spinner />;
  }

  return <div>Create</div>;
};

export default CreateListing;
