import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

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
        <Header/>
      </div>
      <div className="content-container">
        <Outlet />
        loading: {loading && loading}
        <br/>
        data: {data && data.message}
        <br/>
        error: {error && error}
        <br/>
      </div>
    </div>
  </>
);
}

export default FrontPage;