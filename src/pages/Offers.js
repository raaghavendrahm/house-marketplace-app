// Category page content is pasted and minimal necessary modifications are done to create Offers page.

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

// Import LstingItem:
import ListingItem from '../components/ListingItem';

const Offers = () => {
  // Set states:
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize useParams hook:
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference:
        const listingsRef = collection(db, 'listings');

        // Create a query:
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // Execute query:
        const querySnap = await getDocs(q);

        const listings = [];
        querySnap.forEach((doc) => {
          // console.log(doc.data()); // this logs the object of listings data
          return listings.push({
            id: doc.id, // id is not inside doc.data(). so it is fetched separately as doc.id
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Offers;
