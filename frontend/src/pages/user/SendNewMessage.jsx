import { useEffect, useRef, useState } from "react";

// Hooks and utils
import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from "../../hooks/useSubpagePost";

// Components
import Card from "../components/Card";
function SendNewMessage({currentUser, idToken}) {

    // Hooks
    const {data, loading: messageLoading, error: messageError, subpagePost: sendMessage } = useSubpagePost(
        currentUser ? `${BASE_URL}/messages/send/` : null, idToken);

    // States
    const [messageData, setMessageData] = useState();
    const [ response, setResponse ] = useState(null) 
    
    // Refs
    const usernameRef = useRef(null);
    const messageRef = useRef(null);

    // useEffects
    useEffect(() => {
        setMessageData({
            sender_uid: currentUser
        })
    },[]);

    useEffect(() => {
        setResponse(data?.message && data.message);
        if (data?.success === true) {
            usernameRef.current.value = '';
            messageRef.current.value = '';
            setMessageData({});
        }
    },[data]);

    // Handlers
    const handleChange = (e) => {
        setMessageData({
            ...messageData,
            [e.target.name]: e.target.value
        }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendMessage(messageData);
    }
    
    return (
        <>
            <Card>
                <form onSubmit={handleSubmit}>
                    <div>
                        Send to user:
                    </div>
                    <div className="mt-3">
                        <input ref={usernameRef} name="username" onChange={handleChange} placeholder="Send to" />
                    </div>
                    <div className="mt-3">
                        <textarea ref={messageRef} name="message" onChange={handleChange} placeholder="Your message"></textarea>
                    </div>
                    <div className="mt-3 flex flex-row items-center">
                        <div className="mr-5">
                            <button type="submit" className="pr-3 pl-3">Send</button>
                        </div>
                        <div>
                            {
                                response && response
                            }
                        </div>
                    </div>
                </form>
            </Card>
        </>
    );
}

export default SendNewMessage;