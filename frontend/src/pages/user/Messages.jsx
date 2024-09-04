import { useEffect, useContext, useState } from 'react';

import { GlobalContext } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';

// components
import PageHeader from "../components/PageHeader";
import useFetch from '../../hooks/useFetch';

function Messages(props) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    const { data: messageData, loading: messageLoading, error: messageError } = useFetch(
        currentUser ? `${BASE_URL}/messages/inbox/${currentUser.uid}/` : null, idToken)


    // useEffects
    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);

    //console.log(messageData);

    return (
        <>
            <PageHeader headerText="Your inbox" subheaderText="Messages from other users and perhaps even Mike has something to say" />
            {
                currentUser && idToken ? (
                    <>
                        {
                            messageData?.success === true ? (
                                <>
                                    <div className="flex flex-row w-full">
                                        <div className="card w-1/4">
                                            <div className="flex flex-col">
                                                <h3>From</h3>
                                                {
                                                    messageData?.data && Object.keys(messageData.data).map((key, index) => (
                                                        <>
                                                            {key}
                                                        </>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className="ml-5 flex flex-1">
                                            <div className="card">
                                                asdf
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {messageData?.message}
                                </>
                            )
                        }
                    </>
                ) : (
                    <>
                        You need to log in to see your messages.
                    </>
                )
            }
        </>
    );
}

export default Messages