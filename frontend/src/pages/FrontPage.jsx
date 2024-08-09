import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

import { BASE_URL } from '../utils/globalVariables';
import Header from "./components/Header";

function FrontPage() {
  const { currentUser, idToken } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  //console.log("IDTOKEN:", idToken);
  //console.log("CURRENTUSER", currentUser);
  
  const {data, loading, error} = useFetch(`${BASE_URL}/api/test/`, idToken);

return (
  <>
    <div className="page-wrapper">
      <div className="header-container">
        <Header idToken={idToken}/>
      </div>
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  </>
);
}

export default FrontPage;