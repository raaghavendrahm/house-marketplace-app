import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Way to import an image when to be used as a react component:
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

// Way to import an image when to be used as a source img (src) for <img> tag:
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

// To sign in users with email and password:
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// To use toastify for alerts:
import { toast } from 'react-toastify';

const SignIn = () => {
  // State to show password:
  const [showPassword, setShowPassword] = useState(false);

  // State for form data (email and password). Instead of separately having two states for each, one state 'formData' is used (which is an object) to maintain both email and password states:
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Destructing formData to use email and password directly:
  const { email, password } = formData;

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
      // Creating auth:
      const auth = getAuth();

      // Promise returned by signInWithEmailAndPassword is assigned to userCredential:
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // If the credetial is correct (if 'user' is present), navigate to homepage:
      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Incorrect User Credentials');
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

          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        {/* Google OAuth comes here later */}

        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </div>
    </>
  );
};

export default SignIn;
