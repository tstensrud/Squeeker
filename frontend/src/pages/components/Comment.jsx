import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import useFetchDemand from '../../hooks/useFetchDemand';
import useSubpagePost from '../../hooks/useSubpagePost';
import useFetch from '../../hooks/useFetch';

import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// SVG import
import ArrowUp from '../../assets/svg/ArrowUp.svg?react';
import ArrowDown from '../../assets/svg/ArrowDown.svg?react';


function Comment({ msgToParent, data }) {

    const [showReplyContainer, setShowReplyContainer] = useState(false);
    const [reply, setReply] = useState({});
    const { currentUser, idToken } = useContext(AuthContext);

    // Fetch and posts
    const { data: childrenCommentData, loading: childrenCommentDataLoading, error: childrenCommentDataError } = useFetch(`${BASE_URL}/api/subpage/comment/children/${data.uid}/`, idToken);
    //const { data: replyData, error: replyError, fetchData } = useFetchDemand(`${BASE_URL}/api/subpage/comment/children/${data.uid}/`, idToken);
    const { loading, data: replyData, error: replyError, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/comment/reply/new/`, idToken);

    useEffect(() => {
        setReply((prev) => ({
            ...prev,
            authorUid: data.author,
            parentComment: data.uid,
            postUid: data.post_uid,
        }));
    }, []);

    // Close reply container if response from server is positive
    useEffect(() => {
        if (replyData && replyData.success === true) {
            setShowReplyContainer(!showReplyContainer);
        }
    }, [replyData]);

    // Handlers
    const toggleReplySection = (e) => {
        e.preventDefault();
        setShowReplyContainer(!showReplyContainer);
        console.log("Reply")
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

    //console.log(childrenCommentData);

    return (
        <>

            <div className="comment-card">

                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "50px" }}>
                        <div><ArrowUp /></div>
                        <div><ArrowDown /></div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", flex: "1", margin: "0" }}>
                        <div style={{ color: "#808080", fontSize: "13px" }}>
                            <strong>{data.total_votes}</strong> pts. Posted at: {data.timestamp} by: <Link className="link-comment-card" to="#">{data.author_name}</Link>
                        </div>
                        <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                            {data.comment}
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <button className="comment-button" onClick={toggleReplySection}>Reply</button>
                            <button className="comment-button">Share</button>
                        </div>
                        {
                            showReplyContainer === true ? (
                                <>
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
                                </>
                            ) : (<></>)
                        }
                    </div>
                </div>
                {
                    childrenCommentDataLoading && childrenCommentDataLoading === true ? (
                        <>
                            <LoadingSpinner />
                        </>
                    ) : (
                        <>
                            {
                                childrenCommentData && childrenCommentData.success === true ? (
                                    <>

                                        {
                                            Object.keys(childrenCommentData.data).map((key, index) => (
                                                <div key={`${index}+${childrenCommentData.data[key].uid}`} className="comment-children-container">
                                                    <Comment msgToParent="" data={childrenCommentData.data[key]} key={childrenCommentData.data[key].uid} />
                                                </div>
                                            ))
                                        }

                                    </>
                                ) : (
                                    <>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>


        </>
    );
}

export default Comment;