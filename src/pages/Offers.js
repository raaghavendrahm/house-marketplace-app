// Category page content is pasted and minimal necessary modifications are done to create Offers page.

import { useEffect, useState } from 'react';
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
  const [lastFetchedListing, setLastFetchedListing] = useState(null); // pagination

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

        // For Pagination
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

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

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference:
      const listingsRef = collection(db, 'listings');

      // Create a query:
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10) // number of listings fetched on clicking 'load more'
      );

      // Execute query:
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];
      querySnap.forEach((doc) => {
        // console.log(doc.data()); // this logs the object of listings data
        return listings.push({
          id: doc.id, // id is not inside doc.data(). so it is fetched separately as doc.id
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

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

          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Offers;
