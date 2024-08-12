import { Outlet, useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

import { signOut } from "firebase/auth";
import { auth } from '../utils/firebase';

import { BASE_URL } from '../utils/globalVariables';

// SVG imports
import AppIcon from '../assets/svg/AppIcon.svg?react'
import HomeIcon from '../assets/svg/HomeIcon';
import ArrowDown from '../assets/svg/ArrowDown.svg?react';
import Login from '../assets/svg/Login.svg?react';
import Logout from '../assets/svg/Logout.svg?react';
import User from '../assets/svg/User.svg?react';
import NewSubpage from '../assets/svg/NewSubpage.svg?react';

function FrontPage() {
  const { currentUser, idToken, dispatch } = useContext(AuthContext);

  const { data: userData, loading: userDataLoading, error: userDataError } = useFetch(
    currentUser ? `${BASE_URL}/api/user/${currentUser.uid}/` : null,
    idToken
  );

  const [selectedIndex, setSelectexIndex] = useState(0);
  const navigate = useNavigate();

  const mainNavbarItems = [
    { name: "Frontpage", url: "/", svg: <HomeIcon /> },
    { name: "Subpages", url: "/subpages", svg: <ArrowDown /> },
    { name: "Create new subpage", url: "/subpage/create", svg: <NewSubpage /> }
  ];

  const logOut = async (e) => {
    e.preventDefault();
    await signOut(auth).then(() => {
      dispatch({ type: "LOGOUT" });
      navigate("/");
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleNavbarClick = (index) => {
    setSelectexIndex(index);
  }

  return (
    <>
      <div className="page-wrapper">

        <div className="navbar-container">

          <div className="navbar-header-container">
            <div className="navbar-header-icon-container">
              <AppIcon />
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
                              userDataLoading && userDataLoading === true ? "" : userData && userData.data.username
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
                      <Link to="/login">
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
                      <Link to="/register">
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
            Subscribed subpages:
          </div>
          <div className="main-content-container">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default FrontPage;