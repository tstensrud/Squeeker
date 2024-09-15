import { useEffect, useState } from "react";

// Hooks and utils
import useSubmit from "../../hooks/useSubmit";

// Widgets
import LoadingSpinner from '../components/LoadingSpinner';

function ReplyContainer({ setShowReplyContainer, showReplyContainer, name, currentUser, idToken }) {

    const [messageData, setMessageData] = useState();
    const [warning, setWarning] = useState("");

    // Hooks
    const { response: replyResponse, loading: replyLoading, error: messageError, submitData } = useSubmit(
        currentUser ? `messages/send/` : null);

    // useEffects
    useEffect(() => {
        setMessageData({
            username: name,
            sender_uid: currentUser
        });
    }, []);

    useEffect(() => {
        if (replyResponse?.success === true) {
            setShowReplyContainer(!showReplyContainer);
        }
    },[replyResponse])

    // Handlers
    const handleReplyChange = (e) => {
        setMessageData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        })
        )
    }

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!messageData.message) {
            setWarning("Message can not be empty")
            return;
        } else {
            await submitData(messageData);
            setWarning("");
        }
    }

    return (
        <div className="flex flex-col">
            <form onSubmit={handleSendReply}>
                <div className="mt-3">
                    <textarea name="message" onChange={handleReplyChange} placeholder={`Your reply to ${name}`}></textarea>
                </div>
                <div className="flex flex-row mt-3 items-center">
                <div className="mr-3">
                    <button type="submit" className="pl-3 pr-3">Reply</button>
                </div>
                <div>
                    {
                        replyLoading && replyLoading === true && <LoadingSpinner />
                    }
                    {
                        replyResponse?.success === false && replyResponse.message
                    }
                    {
                        warning
                    }
                </div>

                </div>
            </form>
        </div>
    );
}

export default ReplyContainer;