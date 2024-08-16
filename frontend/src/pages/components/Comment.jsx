import { Link } from "react-router-dom";

function Comment({msgToParent, data}) {
    
    const handleMsgToParent = () => {
        const msg = "update";
        msgToParent(msg);
    }

    const commentData = data;
    //console.log(commentData)
    return (
        <>
        <div className="comment-card">
            <div className="comment-card-score">
                pts
            </div>
            <div className="comment-card-header">
                <strong>{commentData.total_votes}</strong> pts. Posted at: {commentData.timestamp} by: <Link className="link-comment-card" to="#">{commentData.author_name}</Link>
            </div>
            <div className="comment-card-content">
                {commentData.comment}
            </div>
            <div className="comment-card-footer">
                Share reply etc
            </div>
            <button onClick={handleMsgToParent}>Test</button>
        </div>
            
        </>
    );
}

export default Comment;