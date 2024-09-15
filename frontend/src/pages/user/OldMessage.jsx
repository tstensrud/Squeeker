import { Link } from "react-router-dom";

import { BASE_URL } from '../../utils/globalVariables';
import useDelete from '../../hooks/useDelete.jsx';

import Card from '../components/Card.jsx'
import { useEffect, useState } from "react";

function OldMessage({ oldMessageData, currentUser }) {
    const { response: deleteResponse, setData: setDeleteData, loading, error: deleteError, deleteEntry } = useDelete(`messages/delete_message/`);

    const [deletedMessage, setDeletedMessage] = useState(false);

    useEffect(() => {
        if (deleteResponse?.success === true) {
            setDeletedMessage(true);
        }
    }, [deleteResponse]);

    useEffect(() => {
        setDeleteData({
            uuid: currentUser,
            message_uid: oldMessageData.uid
        });
    },[]);

    const handleDeleteMessage = async () => {
        await deleteEntry();
    }
    
    return (
        <>
            {
                !deletedMessage && (
                    <div className="mb-3">
                        <Card>
                            <div className="flex flex-col">
                                <div className="flex text-xs flex-row">
                                    <div className="text-grey-text">
                                        Received: {oldMessageData.timestamp}
                                    </div>
                                    <div className="flex flex-1 justify-end">
                                        <span onClick={handleDeleteMessage} className="text-accent-color cursor-pointer">Delete message</span>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    From: {oldMessageData.sender_name}
                                </div>
                                <div>
                                    {oldMessageData.message}
                                </div>
                                <div className="text-xs text-grey-text">
                                    {
                                        oldMessageData.comment_uid && (
                                            <>
                                                In response to your comment in: <Link to={`/room/${oldMessageData.subpage_name}/`}>{oldMessageData.subpage_name}</Link>. Go to <Link to={`/room/${oldMessageData.subpage_name}/post/${oldMessageData.post_uid}`}>comment</Link>
                                            </>
                                        )
                                    }
                                    {
                                        !oldMessageData.comment_uid && oldMessageData.post_uid && (
                                            <>
                                                Commented on your post in <Link to={`/room/${oldMessageData.subpage_name}/`}>{oldMessageData.subpage_name}</Link>. Go to <Link to={`/room/${oldMessageData.subpage_name}/post/${oldMessageData.post_uid}`}>post</Link>
                                            </>
                                        )
                                    }

                                    {
                                        !oldMessageData.comment_uid && !oldMessageData.post_uid && (
                                            <>
                                                Direct message from user
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }

        </>
    );
}

export default OldMessage;