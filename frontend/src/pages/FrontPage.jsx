import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// Firebase
import { signOut } from "firebase/auth";
import { auth } from '../utils/firebase';

// Hooks ++
import useFetch from '../hooks/useFetch';
import useFetchDemand from '../hooks/useFetchDemand';
import { BASE_URL } from '../utils/globalVariables';

// Components
import LoginContainer from './components/LoginContainer';
import RegisterContainer from './components/RegisterContainer.jsx';

// SVG imports
import AppIcon from '../assets/svg/AppIcon.svg?react'
import HomeIcon from '../assets/svg/HomeIcon';
import ArrowDown from '../assets/svg/ArrowDown.svg?react';
import Login from '../assets/svg/Login.svg?react';
import Logout from '../assets/svg/Logout.svg?react';
import User from '../assets/svg/User.svg?react';
import NewSubpage from '../assets/svg/NewSubpage.svg?react';
import AboutIcon from '../assets/svg/AboutIcon.svg?react';
import RoomIcon from '../assets/svg/RoomIcon.svg?react';

// widgets
import LoadingBar from './components/LoadingBar';

function FrontPage() {
  const { currentUser, idToken, dispatch } = useContext(AuthContext);

  // Login and register states
  const [showLoginContainer, setShowLoginCointainer] = useState(false);
  const [showRegisterContainer, setShowRegisterContainer] = useState(false);

  // Initial fetch
  const { data: userData, loading: userDataLoading, error: userDataError, refetch: refetchUserData } = useFetch(
    currentUser ? `${BASE_URL}/api/user/${currentUser.uid}/` : null,
    idToken
  );

  const { data: userSubscriptionsData, loading: userSubscriptionsLoading, error: userSubscriptionsError, refetch: userSubscriptionsRefetch } = useFetch(
    currentUser ? `${BASE_URL}/api/user/subs/${currentUser.uid}/` : null,
    idToken
  );

  // To track active navbar item for styling
  const [selectedIndex, setSelectexIndex] = useState(0);

  const mainNavbarItems = [
    { name: "Frontpage", url: "/", svg: <HomeIcon /> },
    { name: "Rooms", url: "/rooms", svg: <RoomIcon /> },
    { name: "Create new room", url: "/room/create", svg: <NewSubpage /> },
    { name: "About the Lodge", url: "/about", svg: <AboutIcon /> }
  ];

  //console.log(currentUser.uid)
  //console.log(userData);

  // Handlers
  const logOut = async (e) => {
    e.preventDefault();
    await signOut(auth).then(() => {
      dispatch({ type: "LOGOUT" });
      window.location.reload();
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleNavbarClick = (index) => {
    setSelectexIndex(index);
  }

  const openLoginContainer = () => {
    setShowLoginCointainer(true)
  }

  const openRegisterContainer = () => {
    setShowRegisterContainer(true);
  }

  return (
    <>
      <div className="page-wrapper">
        {
          showLoginContainer && showLoginContainer === true ? (

            <LoginContainer userSubscriptionsRefetch={userSubscriptionsRefetch} refetchUserData={refetchUserData} setShowLoginCointainer={setShowLoginCointainer} />

          ) : (
            <>
            </>
          )
        }

        {
          showRegisterContainer && showRegisterContainer === true ? (

            <RegisterContainer refetchUserData={refetchUserData} setShowRegisterContainer={setShowRegisterContainer} />

          ) : (
            <>
            </>
          )
        }

        <div className="navbar-container">
          <div className="navbar-header-container">
            <div className="navbar-header-icon-container">
              <Link to="/">
                <AppIcon />
              </Link>
            </div>
            <h3>The lodge</h3>
          </div>
          <div className="navbar-section-container">
            <ul className="navbar-list">
              {
                mainNavbarItems.map((item, index) => (
                  <li key={index} className={selectedIndex === index ? "navbar-list-item-active" : "navbar-list-item"}>
                    <Link to={item.url} onClick={() => handleNavbarClick(index)}>
                      <div className="navbar-item-container">
                        <div className="navbar-item-icon-container">
                          {item.svg}
                        </div>
                        <div className="navbar-item-label-container">
                          {item.name}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>

          <div className="navbar-section-container">
            {
              idToken !== null && currentUser !== null ? (
                <>
                  <ul className="navbar-list">
                    <li className="navbar-list-item">
                      <Link to="#">
                        <div className="navbar-item-container">
                          <div className="navbar-item-icon-container">
                            <User />
                          </div>
                          <div className="navbar-item-label-container">
                            {
                              userDataLoading && userDataLoading === true ? "" : userData && userData.data !== undefined && userData.data.username
                            }
                          </div>
                        </div>
                      </Link>
                    </li>

                    <li className="navbar-list-item">
                      <Link to="#" onClick={logOut}>
                        <div className="navbar-item-container">
                          <div className="navbar-item-icon-container">
                            <Logout />
                          </div>
                          <div className="navbar-item-label-container">
                            Log out
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <ul className="navbar-list">
                    <li className="navbar-list-item">
                      <Link onClick={openLoginContainer} to="#">
                        <div className="navbar-item-container">
                          <div className="navbar-item-icon-container">
                            <Login />
                          </div>
                          <div className="navbar-item-label-container">
                            Log in
                          </div>
                        </div>
                      </Link>
                    </li>

                    <li className="navbar-list-item">
                      <Link to="#" onClick={openRegisterContainer}>
                        <div className="navbar-item-container">
                          <div className="navbar-item-icon-container">
                            <Login />
                          </div>
                          <div className="navbar-item-label-container">
                            Register
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </>
              )}
          </div >


        </div>

        <div className="content-container">
          <div className="subscribed-subpages-header">
            {
              userSubscriptionsLoading && userSubscriptionsLoading === true ? (

                <LoadingBar />

              ) : (
                <ul className="horizontal-list-small">
                  <li className="horizontal-list-item-small">
                    Subscribed rooms:
                  </li>
                  {
                    userSubscriptionsData && userSubscriptionsData.data !== undefined && userSubscriptionsData.data.map((sub, index) =>

                      <li key={sub} className="horizontal-list-item-small">
                        <Link key={`${sub}+${index}`} className="link-card" to={`/subpage/${sub}/`}>{sub}</Link>&nbsp;/
                      </li>
                    )
                  }
                </ul>
              )

            }

          </div>

          <div className="main-content-container">
            <Outlet context={{ userSubscriptionsRefetch, refetchUserData }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default FrontPage;