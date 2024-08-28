import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// Components
import FrontpageContentLoggedIn from "./FrontpageContentLoggedIn";
import PageHeader from "./components/PageHeader";

function FrontpageContent() {

    const { currentUser, idToken } = useContext(AuthContext);

    return (
        <>
        <PageHeader headerText="The front page of the lodge" subheaderText="A summary of the most recent posts form your subscribed rooms." />
            {   
                // If logged in
                currentUser && idToken ? (
                    <>
                        <FrontpageContentLoggedIn/>
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