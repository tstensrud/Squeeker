import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { GlobalContext } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';

// components
import Message from './Message';
import PageHeader from "../components/PageHeader";
import useFetch from '../../hooks/useFetch';

// Widgets
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function Messages(props) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    const { data: messageData, loading: messageLoading, error: messageError } = useFetch(
        currentUser ? `${BASE_URL}/messages/inbox/${currentUser.uid}/` : null, idToken)

    const [newMessageData, setNewMessageData] = useState({})

    // useEffects
    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);

    // Handlers
    const handleOnSenderClick = (e, messageData) => {
        e.preventDefault();
        setNewMessageData(messageData);
        // send request to backend that message is read
    }

    //console.log(messageData);

    return (
        <>
            <PageHeader headerText="Your inbox" subheaderText="Messages from other users and perhaps even Mike has something to say" />
            {
                currentUser && idToken ? (
                    <>
                        {
                            messageLoading && messageLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    {
                                        messageData?.success === true ? (
                                            <div className="flex flex-row w-full">

                                                <div className="card w-1/4">
                                                    <div className="flex flex-col">
                                                        <h3>New messages</h3>
                                                        {
                                                            messageData?.data && Object.keys(messageData.data).map((key, index) => (
                                                                <div className="flex flex-row" key={index}>
                                                                    <div className="text-grey-text mr-2">
                                                                        From
                                                                    </div>
                                                                    <div>
                                                                        <Link onClick={(e) => handleOnSenderClick(e, messageData?.data[key])} to="#">{messageData?.data[key].sender_name}</Link>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                                <div className="ml-5 flex flex-1">
                                                    <div className="card">
                                                        <Message messageData={newMessageData} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {messageData?.message}
                                            </>
                                        )
                                    }
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