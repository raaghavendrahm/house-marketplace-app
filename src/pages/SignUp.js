import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Way to import an image when to be used as a react component:
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

// Way to import an image when to be used as a source img (src) for <img> tag:
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

// To sign up users using email and password:
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { db } from '../firebase.config';

const SignUp = () => {
  // State to show password:
  const [showPassword, setShowPassword] = useState(false);

  // State for form data (name, email and password). Instead of separately having two states for each, one state 'formData' is used (which is an object) to maintain name, email and password states:
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Destructing formData to use name, email and password directly:
  const { name, email, password } = formData;

  // Initializing useNavigate hook:
  const navigate = useNavigate();

  // On Change:
  // As id names in form input are matched with the state key values (email and password), single onChange is enough to handle all the input values:
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,

      // As the id name and state name are matched, the above works as a general solution. Else, it would have been:
      /* email: e.target.value,
      password: e.target.value */

      // So, as far as the input id names are matching the key name in the state, above works generally.
    }));
  };

  // On Submit
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Creating auth
      const auth = getAuth();

      // createUserWithEmailAndPassword returns a promise with user credentials. Assigning that ot "userCredential"
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Actual user info is derived from userCredential which will be used to store in database later:
      const user = userCredential.user;

      // Updating the display name:
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Redirecting to homepage:
      navigate('/');
    } catch (error) {
      // Now, error is logged, if any. Later, using "toastify" package, error will be displayed in the UI.
      console.log(error);
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name" //id is named same as the key name "name" in formData state to handle onChange easily.
            value={name} // destructured value from formData
            onChange={onChange}
          />

          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email" //id is named same as the key name "email" in formData state to handle onChange easily.
            value={email} // destructured value from formData
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
              id="password" //id is named same as the key name "password" in formData state to handle onChange easily.
              value={password} // destructured value from formData
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        {/* Google OAuth comes here later */}

        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
};

export default SignUp;
