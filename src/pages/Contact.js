import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
// useParams is used to get the id (Ex: y6WIBrNCn59slk82jWlObje4Ca1X), where as useSearchParmas is used to get the query string (Ex: ?listingName)

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

const Contact = () => {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);

  // eslint-disable-next-line
  const [searchParams, setSearchParmas] = useSearchParams(); // different, not using useState

  // Initialization:
  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get landlord data');
      }
    };
    getLandlord();
  }, [params.landlordId]);

  // On Change
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Conatact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button className="primaryButton" type="button">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
