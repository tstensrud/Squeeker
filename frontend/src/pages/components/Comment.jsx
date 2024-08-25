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
    const { data: totalVotes, refetch: refetchTotalVotes } = useFetch(`${BASE_URL}/api/subpage/comment/votes/${commentUid}/`, idToken);

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
            <div className="flex flex-col w-full p-3 mt-5 mb-4 bg-card-bg-color rounded-lg">
                <div className="flex flex-row">
                    <div className="flex flex-col w-12">
                        <VoteboxComment refetchTotalVotes={refetchTotalVotes} postData={commentUid} />
                    </div>

                    <div className="flex flex-col flex-1 m-0">
                        {
                            commentDataLoading && commentDataLoading === true ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <div className="text-xs text-grey-text">
                                        <strong>{totalVotes && totalVotes.data}</strong> pts. Commented at: {commentData && commentData.data && commentData.data.timestamp} by: <Link  to="#">{commentData && commentData.data && commentData.data.author_name}</Link>
                                    </div>
                                    <div className="mb-3 mt-3">
                                        {commentData && commentData.data && commentData.data.comment}
                                    </div>
                                </>
                            )
                        }
                        <div className="flex flex-row">
                            {
                                currentUser && idToken ? (
                                    <>
                                        <button className="mr-3 bg-card-bg-color text-grey-text rounded-lg p-0 border-0 hover:text-link-green" onClick={toggleReplySection}>Reply</button>
                                    </>
                                ) : (<></>)}
                            <button className="mr-3 bg-card-bg-color text-grey-text rounded-lg p-0 border-0 hover:text-link-green">Share</button>
                        </div>
                        {
                            showReplyContainer === true ? (
                                <div className="flex p-3 flex-col bg-card-bg-color">
                                    <form onSubmit={submitReply} className="flex flex-col">
                                        <textarea name="comment" onChange={handleReplyChange} className="bg-app-bg-color border outline-none border-border-color text-base leading-5 p-1 h-20 w-96 mb-3 hover:border-link-green focus:border-link-green " placeholder="Leave a reply"></textarea>
                                        <span>
                                            <button className="mr-3 bg-card-bg-color text-grey-text rounded-lg p-0 border-0 hover:text-link-green">Reply</button>
                                            <button className="mr-3 bg-card-bg-color text-grey-text rounded-lg p-0 border-0 hover:text-link-green" onClick={toggleReplySection}>Cancel</button>
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
                                                <div key={`${index}+${childrenCommentData.data[key]}`} className="flex mt-3 ml-3 p-1 rounded-bl-lg border-l border-b border-border-color">
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