import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

const OAuth = () => {
  // Initialize useLocation and useNavigation hooks:
  const navigate = useNavigate();
  const location = useLocation();

  // On Google Click
  const onGoogleClick = async () => {
    try {
      // Create auth:
      const auth = getAuth();

      // Create a new google auth provider:
      const provider = new GoogleAuthProvider();

      // signInWithPop takes in auth and provider, returns a promise, awaited and stored as result:
      const result = await signInWithPopup(auth, provider);

      // User is extracted from result:
      const user = result.user;

      // Check if user aleardy exists in firestore. If not add them:

      // First, get a reference to the document:
      const docRef = doc(db, 'users', user.uid);

      // If the above reference is present, take a snapshot of the document:
      const docSnap = await getDoc(docRef);

      // If there is no reference to the snapshot (no matching user in the database), create the user in the database:
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          // Data to be added for the signed up user in the database:
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      // Redirect to hompage:
      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google');
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  );
};

export default OAuth;
