import { Link } from "react-router-dom";

function Message({ messageData }) {
    
    return (
        <>
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
                <div className="text-xs text-grey-text">
                    {
                        messageData?.comment_uid && (
                            <Link to="#">
                                Open comment
                            </Link>
                        )
                    }
                    {
                        messageData?.post_uid && (
                            <Link to="#">
                                Go to thread
                            </Link>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default Message;