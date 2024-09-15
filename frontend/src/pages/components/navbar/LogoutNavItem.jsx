// Firebase
import { signOut } from "firebase/auth";
import { auth } from '../../../utils/firebase';

import { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../../../context/AuthContext';
import { GlobalContext } from "../../../context/GlobalContext.jsx";

function LogOutNavitem() {
    const { currentUser, idToken, dispatch } = useContext(AuthContext);
    const { selectedIndex, setSelectedIndex } = useContext(GlobalContext);

    const logOut = async (e) => {
        e.preventDefault();
        await signOut(auth).then(() => {
          dispatch({ type: "LOGOUT" });
          window.location.reload();
        }).catch((error) => {
          //console.log(error);
        });
      }

    return (
        <>
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
        </>
    );
}

export default LogOutNavitem;