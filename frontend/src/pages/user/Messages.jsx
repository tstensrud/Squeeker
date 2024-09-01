import { useEffect, useContext, useState } from 'react';

import { GlobalContext } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';

// components
import PageHeader from "../components/PageHeader";

function Messages (props) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    
    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);

    return (
        <>
            <PageHeader headerText="Your inbox" subheaderText="Messages from other users and perhaps even Mike has something to say" />

        </>
    );
}

export default Messages