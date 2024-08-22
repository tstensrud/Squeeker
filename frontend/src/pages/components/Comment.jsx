import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import useFetchDemand from '../../hooks/useFetchDemand';
import useSubpagePost from '../../hooks/useSubpagePost';
import useFetch from '../../hooks/useFetch';

import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from '../../context/AuthContext';

// Components
import LoadingSpinner from './LoadingSpinner';
import VoteboxComment from './VoteBoxComment';


function Comment({ isChild, commentDataRefech, data }) {
    const commentUid = data
    const [showReplyContainer, setShowReplyContainer] = useState(false);
    const [reply, setReply] = useState({});
    const { currentUser, idToken } = useContext(AuthContext);

    // Fetch and posts
    const { data: commentData, loading: commentDataLoading, error: commentDataError, refetch: commentDataRefetch } = useFetch(`${BASE_URL}/api/subpage/get_comment/${commentUid}/`, idToken);
    const { data: childrenCommentData, loading: childrenCommentDataLoading, error: childrenCommentDataError, refetch: refetchChildrenData } = useFetch(`${BASE_URL}/api/subpage/comment/children/${commentUid}/`, idToken);
    //const { data: replyData, error: replyError, fetchData } = useFetchDemand(`${BASE_URL}/api/subpage/comment/children/${data.uid}/`, idToken);
    const { loading, data: replyData, error: replyError, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/comment/reply/new/`, idToken);

    useEffect(() => {
        setReply((prev) => ({
            ...prev,
            authorUid: commentData && commentData.data && commentData.data.author_uuid,
            parentComment: commentUid,
            postUid: commentData && commentData.data && commentData.data.post_uid,
        }));
    }, [commentData]);

    // Close reply container if response from server is positive
    useEffect(() => {
        if (replyData && replyData.success === true) {
            setShowReplyContainer(!showReplyContainer);
            refetchChildrenData();
        }
    }, [replyData]);


    // Handlers
    const toggleReplySection = (e) => {
        e.preventDefault();
        setShowReplyContainer(!showReplyContainer);

    }

    const submitReply = async (e) => {
        e.preventDefault();
        await subpagePost(reply);
    }

    const handleReplyChange = (e) => {
        setReply((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    return (
        <>
            <div className="comment-card">
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "50px" }}>
                        <VoteboxComment refetch={commentDataRefetch} postData={commentUid}/>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", flex: "1", margin: "0" }}>
                        {
                            commentDataLoading && commentDataLoading === true ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <div style={{ color: "#808080", fontSize: "13px" }}>
                                        <strong>{commentData && commentData.data && commentData.data.total_votes}</strong> pts. Commented at: {commentData && commentData.data && commentData.data.timestamp} by: <Link className="link-comment-card" to="#">{commentData && commentData.data && commentData.data.author_name}</Link>
                                    </div>
                                    <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                                        {commentData && commentData.data && commentData.data.comment}
                                    </div>
                                </>
                            )
                        }
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            {
                                currentUser && idToken ? (
                                    <>
                                        <button className="comment-button" onClick={toggleReplySection}>Reply</button>
                                    </>
                                ) : (<></>)}
                            <button className="comment-button">Share</button>
                        </div>
                        {
                            showReplyContainer === true ? (
                                <div className="comment-reply-container">
                                    <form onSubmit={submitReply} style={{ display: "flex", flexDirection: "column" }}>
                                        <textarea name="comment" onChange={handleReplyChange} className="comment-reply-text-area" placeholder="Leave a reply"></textarea>
                                        <span>
                                            <button className="header-button-left">Reply</button>
                                            <button className="header-button-right" onClick={toggleReplySection}>Cancel</button>
                                        </span>
                                        <p>
                                            {replyData && replyData.success === false ? (replyData.message) : (<></>)}
                                        </p>
                                    </form>
                                </div>
                            ) : (<></>)
                        }
                    </div>
                </div>

                {
                    childrenCommentDataLoading && childrenCommentDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {
                                childrenCommentData && childrenCommentData.success === true ? (
                                    <>
                                        {
                                            childrenCommentData && Object.keys(childrenCommentData.data).map((key, index) => (
                                                <div key={`${index}+${childrenCommentData.data[key]}`} className="comment-children-container">
                                                    <Comment commentDataRefech={commentDataRefech} isChild={true} data={childrenCommentData.data[key]} key={index} />
                                                </div>
                                            ))
                                        }
                                    </>
                                ) : (<></>)
                            }
                        </>
                    )
                }
            </div>
        </>
    );
}

export default Comment;