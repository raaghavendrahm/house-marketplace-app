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

const Category = () => {
  // Set states:
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null); // pagination

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
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10) // number of listings displayed in the beginning
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
  }, [params.categoryName]);

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference:
      const listingsRef = collection(db, 'listings');

      // Create a query:
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
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
        <p className="pageHeader">
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sale'}
        </p>
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
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;
