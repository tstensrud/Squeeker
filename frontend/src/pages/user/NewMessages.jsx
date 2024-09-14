import { useState } from 'react';
import { Link } from "react-router-dom";

// Components
import NewMessage from './NewMessage.jsx';
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Card from '../components/Card.jsx'
import ReplyContainer from './ReplyContainer.jsx';

function NewMessages({ handleMarkAll, updateReadStatus, messageLoading, messageData, idToken, currentUser }) {

    // Handlers
    const handleMarkRead = async (uid) => {
        await updateReadStatus({ uid: uid });
    }

    return (
        <>
            {
                messageLoading === true ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {
                            messageData?.success === true ? (
                                <>
                                
                                    {
                                         messageData?.data && Object.keys(messageData.data).map((key, index) => (
                                            <NewMessage key={index} messageData={messageData.data[key]} handleMarkRead={handleMarkRead} idToken={idToken} currentUser={currentUser} />
                                        ))
                                    }
                                </>
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
    );
}

export default NewMessages;