import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { GlobalContext } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';
import usePatch from "../../hooks/usePatch";
import useFetch from '../../hooks/useFetch';

// components
import Message from './Message';
import PageHeader from "../components/PageHeader";

// Widgets
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function Messages(props) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    // Endpoints
    const { data: messageData, loading: messageLoading, error: messageError, refetch: refetchMessageData } = useFetch(
        currentUser ? `${BASE_URL}/messages/inbox/${currentUser.uid}/` : null, idToken)

    const { data, loading, error, updateData } = usePatch(`${BASE_URL}/messages/read/`, idToken);
    const { data: markAllResponse, updateData: markAllUpdatedData } = usePatch(currentUser ? `${BASE_URL}/messages/markall/${currentUser.uid}/` : null, idToken);
    
    // useStates
    const [newMessageData, setNewMessageData] = useState();

    // useEffects
    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);

    useEffect(() => {
        if (newMessageData?.has_read === false) {
            updateData(newMessageData);
        }
    }, [newMessageData]);

    useEffect(() => {
        if (markAllResponse?.success === true) {
            refetchMessageData();
        }
    }, [markAllResponse])

    // Handlers
    const handleOnSenderClick = (e, messageData) => {
        e.preventDefault();
        setNewMessageData(messageData);
    }

    const handleMarkAll = (e) => {
        e.preventDefault();
        if (currentUser) {
            markAllUpdatedData({});
        }
    }
    
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
                                            <div className="flex flex-row w-full mb-10 ">

                                                <div className="flex flex-col w-1/5">

                                                    <div className="card w-full">
                                                        <div className="flex flex-col w-full">
                                                            <h3>New messages</h3>
                                                            <div className="text-xs mb-3">
                                                                <Link to="#" onClick={handleMarkAll}>Mark all as read</Link>
                                                            </div>
                                                            {
                                                                messageData?.data && Object.keys(messageData.data).map((key, index) => (
                                                                    <div className="flex flex-row" key={index}>
                                                                        {
                                                                            messageData?.data[key].has_read === false && (
                                                                                <div className="flex flex-col mb-2">
                                                                                    <div className="flex flex-row">
                                                                                        <div className="text-grey-text mr-2">
                                                                                            From
                                                                                        </div>
                                                                                        <div>
                                                                                            {messageData?.data[key].sender_name}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Link onClick={(e) => handleOnSenderClick(e, messageData?.data[key])} to="#">{messageData?.data[key].message.slice(0, 18)}...</Link>
                                                                                    </div>
                                                                                    <div className="text-xs text-grey-text">
                                                                                        {messageData?.data[key].event_timestamp}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="card w-full mt-5">
                                                        <div className="flex flex-col w-full">
                                                            <h3>Old messages</h3>
                                                            {
                                                                messageData?.data && Object.keys(messageData?.data).map((key, index) => (
                                                                    <div className="flex flex-row" key={index}>
                                                                        {
                                                                            messageData?.data[key].has_read === true && (
                                                                                <div className="flex flex-col mb-2">
                                                                                    <div className="flex flex-row">
                                                                                        <div className="text-grey-text mr-2">
                                                                                            From
                                                                                        </div>
                                                                                        <div>
                                                                                            {messageData?.data[key].sender_name}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Link onClick={(e) => handleOnSenderClick(e, messageData?.data[key])} to="#">{messageData?.data[key].message.slice(0, 18)}...</Link>
                                                                                    </div>
                                                                                    <div className="text-xs text-grey-text">
                                                                                        {messageData?.data[key].event_timestamp}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ml-5 flex flex-1">
                                                    {
                                                        newMessageData && newMessageData !== undefined &&
                                                        <div>
                                                            <Message messageData={newMessageData} refetchMessageData={refetchMessageData}/>
                                                        </div>
                                                    }
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