import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';

const Navbar = () => {
  // Initialization:
  const navigate = useNavigate();
  const location = useLocation();

  // Create a funtion to return 'true' when route matches the current location. This is used to change the color of icon and text which is selected (on clicking it):
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate('/')}>
            <ExploreIcon
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} // When clicked on this li, route will be '/' (due to navigate() onClick done above) and this will be the input for pathMatchRoute (as given in fill). And the value of location.pathname will also be '/'. So, as the value of input 'route' ('/') and the value of location.pathname ('/') are same, the function returns 'true', and fill color will be '#2c2c2c'. When user clicks on any other page, the values will not match, so won't return 'true', fill color will be '#8f8f8f'. Same logic is applied for all the pages w.r.t their input routes ('/offers', and '/profile').
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute('/')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              } // With the same logic of 'true' output from pathMatchRoute, if 'true', a classname 'navbarListItemNameActive' is applied to text which makes it darker. Else, lighter. Same logic is applied for other routes too.
            >
              Explore
            </p>
          </li>

          <li className="navbarListItem" onClick={() => navigate('/offers')}>
            <OfferIcon
              fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute('/offers')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Offers
            </p>
          </li>

          <li className="navbarListItem" onClick={() => navigate('/profile')}>
            <PersonOutlineIcon
              fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute('/profile')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;
