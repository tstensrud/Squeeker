import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// Components
import FrontpageContentLoggedIn from "./FrontpageContentLoggedIn";

function FrontpageContent() {

    const { currentUser, idToken } = useContext(AuthContext);

    return (
        <>
            {   
                // If logged in
                currentUser && idToken ? (
                    <>
                        <FrontpageContentLoggedIn currentUser={currentUser} idToken={idToken} />
                    </>
                ):(
                // If not logged in
                    <>
                    
                    </>
                )
            }
        </>
    );
}

export default FrontpageContent;