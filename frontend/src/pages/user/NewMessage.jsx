import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import usePatch from "../../hooks/usePatch";

// Components
import Card from '../components/Card.jsx'
import ReplyContainer from './ReplyContainer.jsx';

function NewMessage({ messageData, idToken, currentUser }) {
    const { response, loading, error, updateData } = usePatch(`messages/read/`);
    const [showReplyContainer, setShowReplyContainer] = useState(false);
    const [markedAsRead, setMarkedAsRead] = useState(false);

    useEffect(() => {
        if (response?.success === true) {
            setMarkedAsRead(true);
        }
    }, [response]);

    const handleShowReplyContainer = (e) => {
        e.preventDefault();
        setShowReplyContainer(!showReplyContainer);
    }

    const setMessageAsRead = async () => {
        await updateData({uid: messageData.uid});
    }

    return (
        <>
            {
                markedAsRead === false && (
                    <div className="mb-3">
                        <Card>
                            <div className="flex flex-col">
                                <div className="flex flex-row">
                                    <div className="text-xs text-grey-text">
                                        Received: {messageData.timestamp}
                                    </div>
                                    <div className="flex flex-1 text-xs justify-end text-accent-color">
                                        <span className="cursor-pointer" onClick={setMessageAsRead}>
                                            Mark as read {response?.success === false && <>{response.message}</>}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    From: {messageData.sender_name}
                                </div>
                                <div>
                                    {messageData.message}
                                </div>
                                <div className="text-xs text-grey-text">
                                    {
                                        messageData.comment_uid && (
                                            <>
                                                In response to your comment in: <Link to={`/room/${messageData.subpage_name}/`}>{messageData.subpage_name}</Link>. Go to <Link to={`/room/${messageData.subpage_name}/post/${messageData.post_uid}`}>post</Link>
                                            </>
                                        )
                                    }
                                    {
                                        !messageData.comment_uid && messageData.post_uid && (
                                            <>
                                                Commented on your post in <Link to={`/room/${messageData.subpage_name}/`}>{messageData.subpage_name}</Link>. Go to <Link to={`/room/${messageData.subpage_name}/post/${messageData.post_uid}`}>post</Link>
                                            </>
                                        )
                                    }

                                    {
                                        !messageData.comment_uid && !messageData.post_uid && (
                                            <div className="flex flex-row">
                                                <div className="mr-3">
                                                    Direct message from user.
                                                </div>
                                                <div>
                                                    {
                                                        showReplyContainer ? (
                                                            <Link to="#" onClick={handleShowReplyContainer}>Cancel</Link>
                                                        ) : (
                                                            <Link to="#" onClick={handleShowReplyContainer}>Reply</Link>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    showReplyContainer && (
                                        <ReplyContainer showReplyContainer={showReplyContainer} setShowReplyContainer={setShowReplyContainer} idToken={idToken} currentUser={currentUser} name={messageData.sender_name} />
                                    )
                                }
                            </div>
                        </Card>
                    </div>
                )
            }
        </>
    );
}

export default NewMessage;