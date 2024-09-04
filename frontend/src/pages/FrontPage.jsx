import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GlobalContext } from "../context/GlobalContext.jsx";

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
import NavbarListItem from "./components/NavbarListItem.jsx";

// SVG imports
import AppIcon from '../assets/svg/AppIcon.svg?react'

// widgets
import LoadingBar from './components/LoadingBar';

function FrontPage() {
  const { currentUser, idToken, dispatch } = useContext(AuthContext);
  const { selectedIndex, setSelectedIndex } = useContext(GlobalContext);

  // Login and register states
  const [showLoginContainer, setShowLoginCointainer] = useState(false);
  const [showRegisterContainer, setShowRegisterContainer] = useState(false);

  // Initial fetch
  const { data: userData, loading: userDataLoading, error: userDataError, refetch: refetchUserData } = useFetch(
    currentUser ? `${BASE_URL}/user/${currentUser.uid}/` : null,
    idToken
  );

  const { data: userSubscriptionsData, loading: userSubscriptionsLoading, error: userSubscriptionsError, refetch: userSubscriptionsRefetch } = useFetch(
    currentUser ? `${BASE_URL}/user/subs/${currentUser.uid}/` : null,
    idToken
  );

  const mainNavbarItems = [
    {
      name: "Frontpage", url: "/", svg:
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </>
    },
    {
      name: "Rooms", url: "rooms", svg:
        <>
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          <line x1="12" y1="22" x2="12" y2="15.5"></line>
          <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
          <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
          <line x1="12" y1="2" x2="12" y2="8.5"></line>
        </>
    },
    {
      name: "Create new room", url: "room/create", svg:
        <>
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </>
    },
    {
      name: "About the Lodge", url: "about", svg:
        <>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="17" x2="12" y2="17"></line>
        </>
    }
  ];

  const loggedInNavbarItems = [
    {
      name: userData?.data !== undefined && userData?.data?.username, notification: null, url: "account", svg:
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </>
    },
    {
      name: "Messages", url: "messages", notification: userData?.data?.message_notification ,svg:
        <>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
          </path>
        </>
    },
  ];

  // Handlers
  const logOut = async (e) => {
    e.preventDefault();
    await signOut(auth).then(() => {
      dispatch({ type: "LOGOUT" });
      window.location.reload();
    }).catch((error) => {
      //console.log(error);
    });
  }

  const handleNavbarClick = (index) => {
    setSelectedIndex(index);
  }

  const openLoginContainer = () => {
    setShowLoginCointainer(true)
  }

  const openRegisterContainer = () => {
    setShowRegisterContainer(true);
  }

  return (
    <>
      <div className="flex w-full h-full flex-row">
        {
          showLoginContainer && showLoginContainer === true ? (
            <LoginContainer setShowLoginCointainer={setShowLoginCointainer} />
          ) : (
            <>
            </>
          )
        }

        {
          showRegisterContainer && showRegisterContainer === true ? (
            <RegisterContainer setShowLoginCointainer={setShowLoginCointainer} refetchUserData={refetchUserData} setShowRegisterContainer={setShowRegisterContainer} />
          ) : (
            <>
            </>
          )
        }

        <div className="flex flex-col bg-secondary-color items-center sticky w-80 border-r border-border-color min-h-20 left-0">
          <div className="w-full flex justify-center flex-col text-center mt-3">
            <div className="flex items-center justify-center w-full">
              <Link to="/">
                <AppIcon />
              </Link>
            </div>
            <h3>The lodge</h3>
          </div>
          <div className="w-full flex text-xs pr-4 pl-4 border-b border-border-color pb-3">
            <ul className="list-none mt-4 mb-4 w-full p-0">
              {
                mainNavbarItems.map((item, index) => (
                    <NavbarListItem key={item.url} handleNavbarClick={handleNavbarClick} url={item.url} name={item.name} selectedIndex={selectedIndex} svg={item.svg} index={index} />
                ))
              }
            </ul>
          </div>

          <div className="w-full flex text-xs mt-3 pr-4 pl-4 pb-3 border-b border-border-color">
            {
              idToken !== null && currentUser !== null ? (
                  <ul className="list-none mt-4 mb-4 w-full p-0">
                    {
                      loggedInNavbarItems.map((item, index) => (

                        <NavbarListItem key={item.url} handleNavbarClick={handleNavbarClick} url={item.url} name={item.name} selectedIndex={selectedIndex} notification={item.notification} svg={item.svg} index={index + mainNavbarItems.length} />

                      ))
                    }
                    <Link to="#" onClick={logOut}>
                      <li className="group flex flex-row mr-3 text-base mt-1 p-1 font-normal text-navbar-link hover:text-primary-color transition-colors duration-200">
                        <div className="flex flex-row items-center w-full">
                          <div className="align-middle mr-2 w-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link fill-none line group-hover:stroke-primary-color transition-colors duration-200">
                              <line x1="20" y1="12" x2="4" y2="12"></line>
                              <polyline points="10 18 4 12 10 6"></polyline>
                            </svg>
                          </div>
                          <div className="flex-1">
                            Log out
                          </div>
                        </div>
                      </li>
                    </Link>
                  </ul>
              ) : (
                  <ul className="navbar-list">
                    <Link onClick={openLoginContainer} to="#">
                      <li className="group flex flex-row mr-3 text-base mt-1 p-1 font-normal text-navbar-link hover:text-primary-color">
                        <div className="flex flex-row items-center w-full">
                          <div className="align-middle mr-2 w-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link fill-none line group-hover:stroke-primary-color transition-colors duration-200">
                              <path d="M14 22h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5"></path>
                              <polyline points="11 16 15 12 11 8"></polyline>
                              <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                          </div>
                          <div className="flex-1">
                            Log in
                          </div>
                        </div>
                      </li>
                    </Link>

                    <Link to="#" onClick={openRegisterContainer}>
                      <li className="group flex flex-row mr-3 text-base mt-1 p-1 font-normal text-navbar-link hover:text-primary-color">
                        <div className="flex flex-row items-center w-full">
                          <div className="align-middle mr-2 w-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link fill-none line group-hover:stroke-primary-color transition-colors duration-200">
                              <path d="M14 22h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5"></path>
                              <polyline points="11 16 15 12 11 8"></polyline>
                              <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                          </div>
                          <div className="flex-1">
                            Register
                          </div>
                        </div>
                      </li>
                    </Link>
                  </ul>
              )}
          </div >
        </div>

        <div className="w-full h-full overflow-y-auto">
          <div className="flex w-full flex-col sticky overflow-hidden top-0 z-20 bg-secondary-color text-sm border-b border-border-color p-2 m-0">
            {
              userSubscriptionsLoading && userSubscriptionsLoading ? (
                <LoadingBar />
              ) : (
                <ul className="inline font-bold">
                  <li className="inline mr-3 text-sm tracking-wide">
                    {currentUser  ? "Subscribed rooms: "  : <>Popular rooms: Worldnews &nbsp; / soccer &nbsp; </>}
                  </li>

                  {
                    userSubscriptionsData?.data !== undefined && userSubscriptionsData.data.map((sub, index) =>

                      <li key={sub} className="inline mr-3 text-sm tracking-wide">
                        <Link key={`${sub}+${index}`} to={`/room/${sub}/`}>{sub}</Link>&nbsp;/
                      </li>
                    )
                  }
                </ul>
              )
            }
          </div>
          <div className="w-full pr-12 pl-12">
            <Outlet context={{ userSubscriptionsRefetch, refetchUserData }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default FrontPage;