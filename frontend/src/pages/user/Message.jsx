import { Link } from "react-router-dom";
import { useContext } from "react";

// Hooks ++
import useDelete from '../../hooks/useDelete';
import { BASE_URL } from '../../utils/globalVariables';
import { GlobalContext } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import { useEffect, useState } from "react";


function Message({ messageData, refetchMessageData }) {
    const { currentUser, idToken } = useContext(AuthContext);

    const [serverMessage, setServerMessage] = useState("");

    const { response, loading, error, deleteEntry } = useDelete(
        currentUser ? `${BASE_URL}/messages/delete_message/${messageData.uid}/` : null, idToken);

    // useEffects
    useEffect(() => {
        if (response?.success === false) {
            setServerMessage("Error: ", response?.message);
        }

        if (response?.success === true) {
            setCurrentMessageData({});
        }
    }, [response]);

    // Handlers
    const handleDeleteMessage = async (e) => {
        e.preventDefault();
        await deleteEntry({});
        refetchMessageData();
    }

    return (
        <div className="flex flex-col">
            <div className="w-full flex flex-row text-xs text-grey-text">
                {
                    messageData && messageData !== undefined && (
                        <div className="mr-2">
                            Sent:
                        </div>
                    )
                }
                <div>
                    {messageData?.event_timestamp}
                </div>
            </div>
            <div>
                {messageData?.message}
            </div>
            <div className="flex flex-row w-full mt-3">
                <div className="text-xs text-grey-text">
                    {
                        messageData?.comment_uid ? (
                            <Link to={`/room/${messageData.subpage_name}/post/${messageData.post_uid}/`}>
                                Open comment
                            </Link>
                        ) : (
                            <Link to={`/room/${messageData.subpage_name}/post/${messageData.post_uid}/`}>
                                Go to thread
                            </Link>
                        )
                    }
                </div>
                <div className="text-xs flex flex-1 justify-end">

                    <Link onClick={handleDeleteMessage} to="#">Delete message</Link>

                </div>
            </div>
            <div className="w-full text-center">
                {serverMessage}
            </div>

        </div>
    );
}

export default Message;