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

const Category = () => {
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
          where('type', '==', params.categoryName),
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
  }, [params.categoryName]);

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
                <h3 key={listing.id}>{listing.data.name}</h3>
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;
