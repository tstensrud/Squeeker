import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { GlobalContext } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import usePatch from "../../hooks/usePatch";
import useFetch from '../../hooks/useFetch';
import useFetchRequest from '../../hooks/useFetchRequest.jsx';

// components
import PageHeader from "../components/PageHeader";

// Widgets
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import NewMessages from './NewMessages.jsx';
import OldMessages from './OldMessages.jsx';
import SentMessages from './SentMessages.jsx'
import SendNewMessage from './SendNewMessage.jsx';

function Messages(props) {
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    // States
    const [hasFetchedOld, setHasFetchedOld] = useState(false);
    const [hasFetchedSent, setHasFetchedSent] = useState(false);
    const [navbarIndex, setNavbarIndex] = useState(0);

    // Endpoints
    const { data: messageData, loading: messageLoading, error: messageError, refetch: refetchMessageData } = useFetch(
        currentUser ? `messages/inbox/${currentUser.uid}/` : null)

    const { data: markAllResponse, updateData: markAllUpdatedData } = usePatch(currentUser ? `messages/markall/${currentUser.uid}/` : null);
    const { data: oldMessageData, loading: oldMessageDataLoading, error: oldMessageDataError, fetchData: oldMessageDataFetch } = useFetchRequest(
        currentUser ? `messages/inbox/old/${currentUser.uid}/` : null);

    const { data: sentMessageData, loading: sentMessageDataLoading, error: sentMessageDataError, fetchData: sentMessageDataFetch} = useFetchRequest(
        currentUser ? `messages/sent/${currentUser.uid}/`: null);

    
    // useEffects
    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);
    
    useEffect(() => {
        if (markAllResponse?.success === true) {
            refetchMessageData();
        }
    }, [markAllResponse])
    
    // Handlers
    const handleMarkAll = async (e) => {
        e.preventDefault();
        if (currentUser) {
            await markAllUpdatedData({});
        }
    }
    
    const handleNavbarClick = (index) => {
        if (navbarItems[index].hasFetched !== null && navbarItems[index].setFetched !== null && navbarItems[index].fetch !== null) {
            if (!navbarItems[index].hasFetched) {
                navbarItems[index].fetch();
                navbarItems[index].setFetched(true);
            }
        }
        setNavbarIndex(index);
    }

    const navbarItems = currentUser ? [
        { text: "Inbox", hasFetched: null, setFetched: null, fetch: null, component: <NewMessages messageLoading={messageLoading} messageData={messageData && messageData} currentUser={currentUser.uid} idToken={idToken} /> },
        { text: "Old messages", hasFetched: hasFetchedOld, setFetched: setHasFetchedOld, fetch: oldMessageDataFetch, component: <OldMessages oldMessageDataLoading={oldMessageDataLoading} oldMessageData={oldMessageData && oldMessageData} currentUser={currentUser.uid}/> },
        { text: "Sent", hasFetched: hasFetchedSent, setFetched: setHasFetchedSent, fetch: sentMessageDataFetch, component: <SentMessages sentMessageDataLoading={sentMessageDataLoading} sentMessageData={sentMessageData}  /> },
        { text: "Send new message", hasFetched: null, setFetched: null, fetch: null, component: <SendNewMessage currentUser={currentUser.uid} idToken={idToken} /> }
    ] : null;

    return (
        <>
            <PageHeader headerText="Your inbox" subheaderText="Messages from other users and perhaps even Mike has something to say" />
            {
                currentUser && idToken ? (
                    <>
                        {
                            <>
                                <div className="flex flex-row w-full mt-6">
                                    {
                                        navbarItems.map((item, index) => (
                                            <div key={index} className="mr-3">
                                                <div onClick={() => handleNavbarClick(index)} className={navbarIndex === index ? "border cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-md border-accent-color mb-2 text-center" : "border cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-md border-secondary-color mb-2 text-center hover:border-accent-color"}>
                                                    {item.text}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="flex flex-col w-full">
                                    {
                                        navbarItems[navbarIndex].component
                                    }
                                </div>
                            </>
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