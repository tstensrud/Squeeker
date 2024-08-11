import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

import { BASE_URL } from '../utils/globalVariables';
import Navbar from "./components/Navbar";
import HeaderComponent from "./components/HeaderComponent";

function FrontPage() {
  const { currentUser, idToken } = useContext(AuthContext);
  const { data: userData, loading: userDataLoading, error: userDataError } = useFetch(
    currentUser ? `${BASE_URL}/api/user/${currentUser.uid}/` : null,
    idToken,
    [currentUser, idToken]
  );


  //console.log("IDTOKEN:", idToken);
  //console.log("CURRENTUSER", currentUser);

  return (
    <>
      <div className="page-wrapper">
        <div className="navbar-container">
          <Navbar userData={userData} idToken={idToken} />
        </div>
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default FrontPage;