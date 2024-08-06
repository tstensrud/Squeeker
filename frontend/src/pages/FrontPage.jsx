import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

import Header from "./components/Header";

function FrontPage() {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    getUserData();
  },[])

  const getUserData = async () => {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      setUserData(userData);
      //console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  }

return (
  <>
    <div className="page-wrapper">
      <div className="header-container">
        <Header userData={userData} />
      </div>
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  </>
);
}

export default FrontPage;